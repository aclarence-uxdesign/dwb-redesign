"use client";

import { asset } from "@/lib/assets";
import { useEffect, useState, type ReactNode } from "react";
import {
  activities,
  alerts,
  carePartner,
  goals,
  pain,
  patient,
  restrictions,
  schedule,
  staff,
  therapyOrders,
} from "@/lib/board-data";
import { loadStrokes, paint, subscribe } from "@/lib/drawing";

function Card({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="card">
      <h2 className="card-label">{label}</h2>
      {children}
    </section>
  );
}

function StaffCard() {
  return (
    <Card label="Staff on Duty">
      {staff.map((person, index) => (
        <div className="person" key={`${person.name}-${index}`}>
          <div className="avatar">
            <img src={person.photo} alt="" />
          </div>
          <div>
            <p className="person-name">{person.name}</p>
            <p className="person-role">{person.role}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}

function CarePartnerCard() {
  return (
    <Card label="Care Partner">
      <p className="person-name">{carePartner.name}</p>
      <p className="person-role">{carePartner.detail}</p>
    </Card>
  );
}

function ScheduleCard() {
  return (
    <Card label="Today's Schedule">
      {schedule.map((block) => (
        <div className="day-block" key={block.part}>
          <p className={`day-part${block.muted ? " muted" : ""}`}>{block.part}</p>
          {block.items.map((item) => (
            <div className="schedule-item" key={item.title}>
              <div className="schedule-icon">
                <img src={asset("/media/icon-calendar.svg")} alt="" />
              </div>
              <div className={item.muted ? "muted" : undefined}>
                <p className="item-title">{item.title}</p>
                <p className="item-when">{item.when}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
}

function GoalsCard() {
  return (
    <Card label="Goals for Today">
      {goals.map((goal) => (
        <div className="goal-row" key={goal}>
          <img src={asset("/media/bullet.svg")} alt="" />
          <p className="goal-line">{goal}</p>
        </div>
      ))}
    </Card>
  );
}

function BulletCard({ label, items }: { label: string; items: string[] }) {
  return (
    <Card label={label}>
      {items.map((item) => (
        <div className="bullet-row" key={item}>
          <img src={asset("/media/bullet.svg")} alt="" />
          <p className="goal-line">{item}</p>
        </div>
      ))}
    </Card>
  );
}

function ChipCard({ label, items }: { label: string; items: string[] }) {
  return (
    <Card label={label}>
      <div className="chips">
        {items.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </div>
    </Card>
  );
}

function PainCard() {
  return (
    <Card label="Pain Goal">
      <div className="pain-row">
        <p className="pain-label">Pain Threshold</p>
        <div className="pain-rule" />
        <div className="pain-score">
          <img src={asset("/media/pain-orange.svg")} alt="" />
          <span>{pain.threshold}</span>
        </div>
      </div>
      <div className="pain-row">
        <div className="pain-assessed">
          <p className="pain-label">Last Pain Assessment</p>
          <p className="pain-when">{pain.lastAssessed}</p>
        </div>
        <div className="pain-rule" />
        <div className="pain-score">
          <img src={asset("/media/pain-red.svg")} alt="" />
          <span>{pain.lastScore}</span>
        </div>
      </div>
    </Card>
  );
}

function DrawThumb({ onOpen }: { onOpen: () => void }) {
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    const sync = () => setHasDrawing(loadStrokes().length > 0);
    sync();
    return subscribe(sync);
  }, []);

  return (
    <Card label="Draw">
      <button type="button" className="draw-launch" onClick={onOpen} aria-label="Open draw box">
        {hasDrawing ? <ThumbCanvas /> : <img src={asset("/media/draw-preview.png")} alt="Saved drawing" />}
      </button>
    </Card>
  );
}

function ThumbCanvas() {
  useEffect(() => {
    const canvas = document.getElementById("draw-thumb") as HTMLCanvasElement | null;
    if (!canvas) return;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      paint(ctx, loadStrokes(), canvas.width, canvas.height);
    };
    draw();
    return subscribe(draw);
  }, []);

  return <canvas id="draw-thumb" className="thumb-canvas" width={279} height={279} />;
}

function CustomCard() {
  return (
    <section className="card">
      <h2 className="card-label">Custom Content</h2>
      <p className="custom-title">Content Title</p>
      <div className="custom-canvas">
        <img src={asset("/media/custom-photo.png")} alt="Custom room content" />
      </div>
    </section>
  );
}

function formatNow(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${weekday}, ${month}. ${day} • ${time}`;
}

export function Whiteboard({
  orientation,
  typeScale,
  dim,
  drawOpen,
  updated,
  onDim,
  onType,
  onPower,
  onLock,
  onOpenDraw,
}: {
  orientation: "landscape" | "portrait";
  typeScale: number;
  dim: number;
  drawOpen: boolean;
  updated: string;
  onDim: (direction: -1 | 1) => void;
  onType: (direction: -1 | 1) => void;
  onPower: () => void;
  onLock: () => void;
  onOpenDraw: () => void;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const people = (
    <>
      <StaffCard />
      <CarePartnerCard />
    </>
  );
  const plan = (
    <>
      <ScheduleCard />
      <GoalsCard />
      <BulletCard label="Activities" items={activities} />
    </>
  );
  const clinical = (
    <>
      <ChipCard label="Alerts" items={alerts} />
      <ChipCard label="Restrictions" items={restrictions} />
      <BulletCard label="Therapy Orders" items={therapyOrders} />
      <PainCard />
      <DrawThumb onOpen={onOpenDraw} />
      <CustomCard />
    </>
  );

  return (
    <div className="board" style={{ ["--type-scale" as string]: typeScale }}>
      <header className="board-header">
        <div className="logo-lockup">
          <img src={asset("/media/logo.png")} alt="Community hospital" />
        </div>
        <div>
          <h1 className="patient-name">{patient.name}</h1>
          <div className="patient-meta">
            <span className="language-chip">{patient.language}</span>
            <p className="patient-service">{patient.service}</p>
          </div>
        </div>
        <div className="header-time">
          <p className="header-clock">{now ? formatNow(now) : "Thursday, Sep. 18 • 10:29 AM"}</p>
          <p className="header-discharge">Estimated Discharge: {patient.discharge}</p>
        </div>
      </header>

      <div className="board-columns" data-orientation={orientation}>
        {orientation === "landscape" ? (
          <>
            <div className="column">{people}</div>
            <div className="column">{plan}</div>
            <div className="column">{clinical}</div>
          </>
        ) : (
          <>
            <div className="column">
              {people}
              <ChipCard label="Alerts" items={alerts} />
              <ChipCard label="Restrictions" items={restrictions} />
              <PainCard />
            </div>
            <div className="column">
              <ScheduleCard />
              <GoalsCard />
              <BulletCard label="Activities" items={activities} />
              <BulletCard label="Therapy Orders" items={therapyOrders} />
              <DrawThumb onOpen={onOpenDraw} />
              <CustomCard />
            </div>
          </>
        )}
      </div>

      <footer className="controls">
        <div className="control-cluster">
          <div className="control-group">
            <button
              type="button"
              className="round-btn"
              data-invert="true"
              aria-label="Dim the display"
              disabled={drawOpen}
              onClick={() => onDim(1)}
            >
              <img src={asset("/media/icon-minus.svg")} alt="" />
            </button>
            <span className="control-label">Dim</span>
            <button
              type="button"
              className="round-btn"
              data-invert="true"
              aria-label="Brighten the display"
              disabled={drawOpen}
              onClick={() => onDim(-1)}
            >
              <img src={asset("/media/icon-plus.svg")} alt="" />
            </button>
          </div>
          <button
            type="button"
            className="power-btn"
            disabled={drawOpen}
            onClick={onPower}
            aria-label="Turn the display off"
          >
            <img src={asset("/media/icon-power.svg")} alt="" />
            <span>On/Off</span>
          </button>
          <div className="control-group">
            <button
              type="button"
              className="round-btn"
              data-invert="true"
              aria-label="Decrease text size"
              onClick={() => onType(-1)}
            >
              <img src={asset("/media/icon-minus.svg")} alt="" />
            </button>
            <span className="control-label">Font</span>
            <button
              type="button"
              className="round-btn"
              data-filled="true"
              aria-label="Increase text size"
              onClick={() => onType(1)}
            >
              <img src={asset("/media/icon-plus-dark.svg")} alt="" />
            </button>
          </div>
          <button type="button" className="round-btn" data-invert="true" aria-label="Lock the display" onClick={onLock}>
            <img src={asset("/media/icon-fingerprint.svg")} alt="" />
          </button>
        </div>
        <p className="updated">Last updated {updated}</p>
      </footer>
      {dim > 0 ? <div className="dim-veil" style={{ opacity: dim }} /> : null}
    </div>
  );
}
