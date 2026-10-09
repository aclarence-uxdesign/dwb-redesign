export type Point = { x: number; y: number };

export type Stroke = {
  id: string;
  points: Point[];
  color: string;
  size: number;
  erase: boolean;
};

const STORAGE_KEY = "dwb-strokes";
const CHANNEL_NAME = "dwb-draw";

type Listener = () => void;

const listeners = new Set<Listener>();
let channel: BroadcastChannel | null = null;

function getChannel() {
  if (typeof window === "undefined") return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

export function loadStrokes(): Stroke[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Stroke[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStrokes(strokes: Stroke[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(strokes));
  listeners.forEach((listener) => listener());
  getChannel()?.postMessage({ type: "sync" });
}

export function clearStrokes() {
  saveStrokes([]);
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  const bus = getChannel();
  const onMessage = () => listener();
  bus?.addEventListener("message", onMessage);
  return () => {
    listeners.delete(listener);
    bus?.removeEventListener("message", onMessage);
  };
}

export function paint(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  width: number,
  height: number,
  live?: Stroke | null,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  const all = live ? [...strokes, live] : strokes;
  for (const stroke of all) {
    if (stroke.points.length === 0) continue;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, stroke.size * Math.min(width, height));
    ctx.strokeStyle = stroke.erase ? "#ffffff" : stroke.color;
    ctx.beginPath();
    stroke.points.forEach((point, index) => {
      const x = point.x * width;
      const y = point.y * height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    if (stroke.points.length === 1) {
      const point = stroke.points[0];
      ctx.lineTo(point.x * width + 0.2, point.y * height + 0.2);
    }
    ctx.stroke();
    ctx.restore();
  }
}
