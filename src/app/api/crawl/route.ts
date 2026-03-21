import { NextRequest } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { writeKnowledge, readKnowledge } from "@/lib/storage";
import { getUserIdFromCookie } from "@/lib/auth";



function extractText(html: string, baseUrl: string): { text: string; links: string[] } {
    const $ = cheerio.load(html);
    $("script, style, nav, footer, head, noscript, svg, img").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();

    const links: string[] = [];
    const origin = new URL(baseUrl).origin;

    $("a[href]").each((_, el) => {
        const href = $(el).attr("href") || "";
        try {
            const absolute = new URL(href, baseUrl).href;
            if (absolute.startsWith(origin) && !absolute.includes("#") && !absolute.includes("?")) {
                links.push(absolute);
            }
        } catch { }
    });

    return { text, links: [...new Set(links)] };
}


export async function POST(req: NextRequest) {
    const { url, apiKey, extraUrls = [] } = await req.json();

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            function send(data: object) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            }

            try {
                if (!url || !apiKey) {
                    send({ type: "error", message: "URL and API key are required." });
                    controller.close();
                    return;
                }

                new URL(url); // validate

                const visited = new Set<string>();
                const queue = [url, ...extraUrls.filter(Boolean)];
                const allContent: string[] = [];
                const MAX_PAGES = 15;

                send({ type: "start", message: `Starting crawl for ${url}` });

                const userId = await getUserIdFromCookie();
                if (!userId) {
                    send({ type: "error", message: "Not authenticated." });
                    controller.close();
                    return;
                }

                while (queue.length > 0 && visited.size < MAX_PAGES) {
                    const current = queue.shift()!;
                    if (visited.has(current)) continue;
                    visited.add(current);

                    send({ type: "crawling", page: current, count: visited.size, total: Math.min(queue.length + visited.size, MAX_PAGES) });

                    try {
                        const response = await axios.get(current, {
                            timeout: 8000,
                            headers: { "User-Agent": "Mozilla/5.0 (compatible; ChatBot-Crawler/1.0)" },
                        });

                        const { text, links } = extractText(response.data, current);

                        if (text.length > 100) {
                            allContent.push(`\n\n--- Page: ${current} ---\n${text.slice(0, 3000)}`);
                            send({ type: "page_done", page: current, chars: text.length });
                        }

                        for (const link of links) {
                            if (!visited.has(link)) queue.push(link);
                        }
                    } catch {
                        send({ type: "page_error", page: current });
                    }
                }

                if (allContent.length === 0) {
                    send({ type: "error", message: "Could not extract content from this site." });
                    controller.close();
                    return;
                }



                const existing = await readKnowledge(userId);
                const combinedContent = existing.url === url
                    ? existing.content + "\n" + allContent.join("\n").slice(0, 8000)
                    : allContent.join("\n").slice(0, 12000);

                writeKnowledge(userId, {
                    url,
                    apiKey,
                    content: combinedContent,
                    crawledAt: new Date().toISOString(),

                });

                send({
                    type: "done",
                    pagesCrawled: visited.size,
                    characters: combinedContent.length,
                });

            } catch (err: any) {
                send({ type: "error", message: err?.message || "Crawl failed." });
            }

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}