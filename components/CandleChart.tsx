"use client";

import { useEffect, useRef } from "react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
}

const COUNT = 36;
const BASE = 2380;

function randomStep(): number {
  return (Math.random() - 0.48) * 6;
}

function nextCandle(previous: number): Candle {
  const open = previous;
  const close = Math.max(BASE - 60, Math.min(BASE + 90, open + randomStep()));
  const high = Math.max(open, close) + Math.random() * 3;
  const low = Math.min(open, close) - Math.random() * 3;
  return { open, close, high, low };
}

export default function CandleChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let candles: Candle[] = [];
    let lastPrice = BASE;
    for (let i = 0; i < COUNT; i++) {
      const candle = nextCandle(lastPrice);
      candles.push(candle);
      lastPrice = candle.close;
    }

    let frame = 0;
    let raf = 0;
    let running = true;

    const resize = (): void => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number): void => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const prices = candles.flatMap((c) => [c.high, c.low]);
      const min = Math.min(...prices) - 4;
      const max = Math.max(...prices) + 4;
      const y = (price: number): number => h - ((price - min) / (max - min)) * h;

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / 4) * i);
        ctx.lineTo(w, (h / 4) * i);
        ctx.stroke();
      }

      const slot = w / COUNT;
      const bodyWidth = slot * 0.55;
      const shift = ((now / 24) % slot) * 0.999;

      candles.forEach((candle, i) => {
        const x = i * slot - shift + slot / 2;
        const up = candle.close >= candle.open;
        const color = up ? "#E8C25A" : "rgba(160,120,40,0.85)";
        const glow = up ? "rgba(232,194,90,0.45)" : "rgba(160,120,40,0.25)";

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y(candle.high));
        ctx.lineTo(x, y(candle.low));
        ctx.stroke();

        ctx.shadowColor = glow;
        ctx.shadowBlur = up ? 8 : 0;
        ctx.fillStyle = color;
        const top = y(Math.max(candle.open, candle.close));
        const bottom = y(Math.min(candle.open, candle.close));
        ctx.fillRect(x - bodyWidth / 2, top, bodyWidth, Math.max(bottom - top, 1.5));
        ctx.shadowBlur = 0;
      });
    };

    const tick = (now: number): void => {
      if (!running) return;
      frame++;
      if (frame % 24 === 0) {
        candles.push(nextCandle(lastPrice));
        candles = candles.slice(-COUNT);
        lastPrice = candles[candles.length - 1].close;
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);

    const onVisibility = (): void => {
      running = document.visibilityState === "visible";
      if (running) tick(performance.now());
    };
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
