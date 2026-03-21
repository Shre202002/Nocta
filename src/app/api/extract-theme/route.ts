import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// Extract hex colors from CSS text
function extractColorsFromCSS(css: string): string[] {
  const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  const rgbPattern = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  const colors: string[] = [];

  let match;
  while ((match = hexPattern.exec(css)) !== null) {
    colors.push("#" + match[1]);
  }

  while ((match = rgbPattern.exec(css)) !== null) {
    const hex = rgbToHex(
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3])
    );
    colors.push(hex);
  }

  return colors;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

// Score a color — prefer non-white, non-black, saturated colors
function scoreColor(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const lightness = (max + min) / 2;
  const saturation = max === min ? 0 : (max - min) / (1 - Math.abs(2 * lightness - 1));

  // Penalize near-white and near-black
  if (lightness > 0.92 || lightness < 0.08) return 0;
  // Reward saturation
  return saturation * (1 - Math.abs(lightness - 0.45));
}

// Generate a lighter/darker variant of a color
function adjustColor(hex: string, amount: number): string {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amount));
  return rgbToHex(r, g, b);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: "URL required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const response = await axios.get(url, {
      timeout: 8000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ThemeBot/1.0)" },
    });

    const $ = cheerio.load(response.data);
    const allColors: string[] = [];

    // Extract from inline styles
    $("[style]").each((_, el) => {
      const style = $(el).attr("style") || "";
      allColors.push(...extractColorsFromCSS(style));
    });

    // Extract from <style> tags
    $("style").each((_, el) => {
      allColors.push(...extractColorsFromCSS($(el).html() || ""));
    });

    // Extract from linked CSS files
    const cssLinks: string[] = [];
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        try {
          cssLinks.push(new URL(href, url).href);
        } catch {}
      }
    });

    // Fetch up to 2 CSS files
    for (const cssUrl of cssLinks.slice(0, 2)) {
      try {
        const cssRes = await axios.get(cssUrl, { timeout: 5000 });
        allColors.push(...extractColorsFromCSS(cssRes.data));
      } catch {}
    }

    // Normalize 3-digit hex to 6-digit
    const normalized = allColors.map((c) => {
      if (c.length === 4) {
        return "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
      }
      return c.toLowerCase();
    });

    // Deduplicate and score
    const unique = [...new Set(normalized)];
    const scored = unique
      .map((c) => ({ color: c, score: scoreColor(c) }))
      .filter((c) => c.score > 0.1)
      .sort((a, b) => b.score - a.score);

    // Pick primary and accent
    const primary = scored[0]?.color || "#6366f1";
    const accent = scored[1]?.color || adjustColor(primary, -30);

    const theme = {
      bubbleColor: primary,
      headerColor: primary,
      userMsgColor: primary,
      sendBtnColor: primary,
      accentColor: accent,
    };

    return NextResponse.json({
      theme,
      palette: scored.slice(0, 8).map((c) => c.color),
    }, { headers: corsHeaders });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Could not extract theme." },
      { status: 500, headers: corsHeaders }
    );
  }
}