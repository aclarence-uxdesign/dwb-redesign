"use client";

import { asset } from "@/lib/assets";
import { orientationForDisplay, type Orientation } from "@/lib/orientation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { DrawPanel } from "@/components/draw-panel";
import { EmailDialog } from "@/components/email-dialog";
import { PinScreen } from "@/components/pin-screen";
import { Whiteboard } from "@/components/whiteboard";

const STAGE = {
  landscape: { width: 3840, height: 2116 },
  portrait: { width: 2116, height: 3840 },
} as const;

const TYPE_STEPS = [0.9, 1, 1.08, 1.16];
const DIM_STEPS = [0, 0.18, 0.34, 0.5, 0.66];

export function RoomApp() {
  const [registered, setRegistered] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [scale, setScale] = useState(1);
  const [frame, setFrame] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const [typeIndex, setTypeIndex] = useState(1);
  const [dimIndex, setDimIndex] = useState(0);
  const [powerOff, setPowerOff] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [updated, setUpdated] = useState("12:00 AM");

  const stage = STAGE[orientation];

  useEffect(() => {
    let timers: number[] = [];

    const measure = () => {
      const viewport = window.visualViewport;
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;
      const next = orientationForDisplay({
        viewWidth,
        viewHeight,
        screenWidth: window.screen?.width ?? viewWidth,
        screenHeight: window.screen?.height ?? viewHeight,
      });
      const size = STAGE[next];
      setOrientation(next);
      setFrame({
        width: viewWidth,
        height: viewHeight,
        top: viewport?.offsetTop ?? 0,
        left: viewport?.offsetLeft ?? 0,
      });
      setScale(Math.min(viewWidth / size.width, viewHeight / size.height));
    };

    const onRotate = () => {
      measure();
      timers.forEach((timer) => window.clearTimeout(timer));
      timers = [120, 400, 800].map((delay) => window.setTimeout(measure, delay));
    };

    measure();
    const portraitQuery = window.matchMedia("(orientation: portrait)");
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener("resize", onRotate);
    window.addEventListener("orientationchange", onRotate);
    portraitQuery.addEventListener("change", onRotate);
    window.screen?.orientation?.addEventListener("change", onRotate);
    window.visualViewport?.addEventListener("resize", onRotate);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      window.removeEventListener("resize", onRotate);
      window.removeEventListener("orientationchange", onRotate);
      portraitQuery.removeEventListener("change", onRotate);
      window.screen?.orientation?.removeEventListener("change", onRotate);
      window.visualViewport?.removeEventListener("resize", onRotate);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, []);

  const style = useMemo(
    () =>
      ({
        "--stage-w": `${stage.width}px`,
        "--stage-h": `${stage.height}px`,
        "--scale": String(scale),
      }) as CSSProperties,
    [scale, stage.height, stage.width],
  );

  function stampUpdate() {
    setUpdated(
      new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
    );
  }

  return (
    <>
      <main
        className="viewport"
        style={{
          position: "fixed",
          width: frame.width ? `${frame.width}px` : "100%",
          height: frame.height ? `${frame.height}px` : "100dvh",
          top: frame.top,
          left: frame.left,
        }}
      >
        <div className="stage-slot" style={style}>
          <div
            className="stage"
            style={style}
            data-orientation={orientation}
            data-screen={registered ? "board" : "pin"}
          >
            {registered ? (
              <Whiteboard
                orientation={orientation}
                typeScale={TYPE_STEPS[typeIndex]}
                dim={DIM_STEPS[dimIndex]}
                drawOpen={drawOpen}
                updated={updated}
                onDim={(direction) =>
                  setDimIndex((index) => Math.min(DIM_STEPS.length - 1, Math.max(0, index + direction)))
                }
                onType={(direction) =>
                  setTypeIndex((index) => Math.min(TYPE_STEPS.length - 1, Math.max(0, index + direction)))
                }
                onPower={() => setPowerOff(true)}
                onLock={() => {
                  setRegistered(false);
                  setDrawOpen(false);
                  setEmailOpen(false);
                  setPowerOff(false);
                }}
                onOpenDraw={() => setDrawOpen(true)}
              />
            ) : (
              <PinScreen onSuccess={() => setRegistered(true)} />
            )}
            {registered && drawOpen ? (
              <DrawPanel
                onClose={() => {
                  setDrawOpen(false);
                  stampUpdate();
                }}
                onShare={() => setEmailOpen(true)}
              />
            ) : null}
            {emailOpen ? <EmailDialog onClose={() => setEmailOpen(false)} /> : null}
            {powerOff ? (
              <div className="power-off">
                <div>
                  <button type="button" className="power-btn" onClick={() => setPowerOff(false)}>
                    <img src={asset("/media/icon-power.svg")} alt="" />
                    <span>On/Off</span>
                  </button>
                  <p>Display is off. Press On/Off to wake the room board.</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}
