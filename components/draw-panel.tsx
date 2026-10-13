"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { drawGuidance, inkColors, lineWeights } from "@/lib/board-data";
import { clearStrokes, loadStrokes, paint, saveStrokes, subscribe, type Stroke } from "@/lib/drawing";
import { QrCode } from "@/components/qr-code";
import { asset } from "@/lib/assets";

type Tool = "pen" | "eraser";

export function DrawPanel({
  onClose,
  onShare,
}: {
  onClose: () => void;
  onShare: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const liveRef = useRef<Stroke | null>(null);
  const toolRef = useRef<{ color: string; size: number; erase: boolean }>({
    color: inkColors[0],
    size: lineWeights[1],
    erase: false,
  });
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(inkColors[0]);
  const [size, setSize] = useState(lineWeights[1]);
  const [menu, setMenu] = useState<"color" | "weight" | null>(null);
  const [companionUrl, setCompanionUrl] = useState("/companion");

  useEffect(() => {
    setCompanionUrl(`${window.location.origin}${asset("/companion")}`);
  }, []);

  useEffect(() => {
    toolRef.current = { color, size, erase: tool === "eraser" };
  }, [color, size, tool]);

  useEffect(() => {
    const panel = panelRef.current;
    const viewport = panel?.closest(".viewport");
    if (!panel || !viewport) return;

    const place = () => {
      const scale = Number.parseFloat(getComputedStyle(panel).getPropertyValue("--scale")) || 1;
      const margin = 36;
      panel.style.top = `${viewport.scrollTop / scale + margin}px`;
      panel.style.height = `${Math.max(480, viewport.clientHeight / scale - margin * 2)}px`;
    };

    place();
    viewport.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      viewport.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, []);

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
      if (width === 0 || height === 0) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      redraw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return subscribe(() => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      paint(ctx, loadStrokes(), canvas.width, canvas.height, liveRef.current);
    });
  }, []);

  function pointFromEvent(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  }

  function redrawLive() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paint(ctx, loadStrokes(), canvas.width, canvas.height, liveRef.current);
  }

  return (
    <section ref={panelRef} className="draw-panel" role="dialog" aria-label="Draw box">
      <div className="draw-toolbar">
        <button
          type="button"
          className="tool-btn"
          aria-label="Clear drawing"
          onClick={() => {
            clearStrokes();
            setMenu(null);
          }}
        >
          <img src={asset("/media/icon-delete.svg")} alt="" />
        </button>
        <button
          type="button"
          className="tool-btn"
          aria-label="Send drawing by email"
          onClick={() => {
            setMenu(null);
            onShare();
          }}
        >
          <img src={asset("/media/icon-share.svg")} alt="" />
        </button>
        <button
          type="button"
          className="tool-btn"
          data-active={menu === "color"}
          aria-label="Choose ink color"
          onClick={() => {
            setTool("pen");
            setMenu((current) => (current === "color" ? null : "color"));
          }}
        >
          <img src={asset("/media/icon-palette.svg")} alt="" />
        </button>
        <button
          type="button"
          className="tool-btn"
          data-active={menu === "weight"}
          aria-label="Choose line weight"
          onClick={() => {
            setTool("pen");
            setMenu((current) => (current === "weight" ? null : "weight"));
          }}
        >
          <img src={asset("/media/icon-weight.svg")} alt="" />
        </button>
        <button
          type="button"
          className="tool-btn"
          data-active={tool === "eraser"}
          aria-label="Eraser"
          onClick={() => {
            setTool("eraser");
            setMenu(null);
          }}
        >
          <img src={asset("/media/icon-eraser.svg")} alt="" />
        </button>
        <button type="button" className="tool-btn" aria-label="Minimize draw box" onClick={onClose}>
          <img src={asset("/media/icon-x.svg")} alt="" />
        </button>
        {menu === "color" ? (
          <div className="tool-pop" style={{ left: "38%" }}>
            {inkColors.map((ink) => (
              <button
                key={ink}
                type="button"
                className="swatch"
                style={{ background: ink }}
                data-active={color === ink}
                aria-label={`Ink ${ink}`}
                onClick={() => {
                  setColor(ink);
                  setTool("pen");
                  setMenu(null);
                }}
              />
            ))}
          </div>
        ) : null}
        {menu === "weight" ? (
          <div className="tool-pop" style={{ left: "48%" }}>
            {lineWeights.map((weight) => (
              <button
                key={weight}
                type="button"
                className="weight-choice"
                data-active={size === weight}
                aria-label={`Line weight ${weight}`}
                onClick={() => {
                  setSize(weight);
                  setTool("pen");
                  setMenu(null);
                }}
              >
                <span style={{ width: 28, height: Math.max(4, weight * 700) }} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="draw-surface">
        <canvas
          ref={canvasRef}
          aria-label="Drawing canvas"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            const current = toolRef.current;
            liveRef.current = {
              id: crypto.randomUUID(),
              points: [pointFromEvent(event)],
              color: current.color,
              size: current.size,
              erase: current.erase,
            };
            redrawLive();
          }}
          onPointerMove={(event) => {
            if (!liveRef.current) return;
            liveRef.current = {
              ...liveRef.current,
              points: [...liveRef.current.points, pointFromEvent(event)],
            };
            redrawLive();
          }}
          onPointerUp={() => {
            if (!liveRef.current) return;
            saveStrokes([...loadStrokes(), liveRef.current]);
            liveRef.current = null;
          }}
          onPointerCancel={() => {
            liveRef.current = null;
            redrawLive();
          }}
        />
      </div>
      <div className="draw-footer">
        <ul>
          {drawGuidance.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <QrCode value={companionUrl} />
      </div>
    </section>
  );
}
