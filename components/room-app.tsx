"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { DrawPanel } from "@/components/draw-panel";
import { EmailDialog } from "@/components/email-dialog";
import { PinScreen } from "@/components/pin-screen";
import { Whiteboard } from "@/components/whiteboard";

type Orientation = "landscape" | "portrait";
type Pref = "auto" | Orientation;

const STAGE = {
  landscape: { width: 3840, height: 2116 },
  portrait: { width: 2116, height: 3840 },
} as const;

const TYPE_STEPS = [0.9, 1, 1.08, 1.16];
const DIM_STEPS = [0, 0.18, 0.34, 0.5, 0.66];

export function RoomApp() {
  const [registered, setRegistered] = useState(false);
  const [pref, setPref] = useState<Pref>("auto");
  const [natural, setNatural] = useState<Orientation>("landscape");
  const [scale, setScale] = useState(1);
  const [typeIndex, setTypeIndex] = useState(1);
  const [dimIndex, setDimIndex] = useState(0);
  const [powerOff, setPowerOff] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [updated, setUpdated] = useState("12:00 AM");

  const orientation: Orientation = pref === "auto" ? natural : pref;
  const stage = STAGE[orientation];

  useEffect(() => {
    const measure = () => {
      const nextNatural: Orientation =
        window.innerHeight > window.innerWidth ? "portrait" : "landscape";
      setNatural(nextNatural);
      const active = pref === "auto" ? nextNatural : pref;
      const size = STAGE[active];
      const nextScale = Math.min(window.innerWidth / size.width, window.innerHeight / size.height);
      setScale(nextScale);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pref]);

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
      <main className="viewport">
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
                    <img src="/media/icon-power.svg" alt="" />
                    <span>On/Off</span>
                  </button>
                  <p>Display is off. Press On/Off to wake the room board.</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <div className="preview-switch" role="group" aria-label="Display orientation">
        <span>PIN {`2580`}</span>
        {(
          [
            ["auto", "Auto"],
            ["landscape", "Landscape"],
            ["portrait", "Portrait"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            data-active={pref === value}
            onClick={() => setPref(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
