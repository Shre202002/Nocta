'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type DottedSurfaceProps = React.ComponentProps<'div'>;

export function DottedSurface({ className, children, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvasRef.current = canvas;
    canvas.className = 'absolute inset-0 h-full w-full';
    container.appendChild(canvas);

    let raf = 0;
    let t = 0;

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = container;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      const sep = 28;

      for (let x = 0; x < w; x += sep) {
        for (let y = 0; y < h; y += sep) {
          const wave = Math.sin((x + t) * 0.01) * Math.cos((y + t) * 0.012);
          const alpha = 0.04 + (wave + 1) * 0.06;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, 1.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      t += 1.7;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      if (canvasRef.current?.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
}
