"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { inkColors, lineWeights } from "@/lib/board-data";
import { clearStrokes, loadStrokes, paint, saveStrokes, subscribe, type Stroke } from "@/lib/drawing";

export default function CompanionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<Stroke | null>(null);
  const [color, setColor] = useState(inkColors[0]);
  const size = lineWeights[1];
  const [erase, setErase] = useState(false);
  const toolRef = useRef({ color, size, erase });

  useEffect(() => {
    toolRef.current = { color, size, erase };
  }, [color, size, erase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const redraw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      paint(ctx, loadStrokes(), canvas.width, canvas.height, liveRef.current);
    };
    const resize = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (!width || !height) return;
      canvas.width = width;
      canvas.height = height;
      redraw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => subscribe(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paint(ctx, loadStrokes(), canvas.width, canvas.height, liveRef.current);
  }), []);

  function point(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  }

  return (
    <main className="companion">
      <header>
        <h1>Draw with your phone</h1>
        <p>Strokes made here appear on the patient room whiteboard.</p>
      </header>
      <div className="companion-tools">
        {inkColors.map((ink) => (
          <button
            key={ink}
            type="button"
            data-active={!erase && color === ink}
            aria-label={`Color ${ink}`}
            style={{ background: ink, color: "white", width: 44, height: 44, padding: 0 }}
            onClick={() => {
              setColor(ink);
              setErase(false);
            }}
          />
        ))}
        <button type="button" data-active={erase} onClick={() => setErase(true)}>
          Erase
        </button>
        <button type="button" onClick={() => clearStrokes()}>
          Clear
        </button>
      </div>
      <div className="companion-canvas-wrap">
        <canvas
          ref={canvasRef}
          aria-label="Mobile drawing canvas"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            const current = toolRef.current;
            liveRef.current = {
              id: crypto.randomUUID(),
              points: [point(event)],
              color: current.color,
              size: current.size,
              erase: current.erase,
            };
          }}
          onPointerMove={(event) => {
            if (!liveRef.current) return;
            liveRef.current = {
              ...liveRef.current,
              points: [...liveRef.current.points, point(event)],
            };
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;
            paint(ctx, loadStrokes(), canvas.width, canvas.height, liveRef.current);
          }}
          onPointerUp={() => {
            if (!liveRef.current) return;
            saveStrokes([...loadStrokes(), liveRef.current]);
            liveRef.current = null;
          }}
        />
      </div>
    </main>
  );
}
