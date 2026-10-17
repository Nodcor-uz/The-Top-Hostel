import { useEffect, useRef, useState } from "react";
import { orbitShots, shots } from "@/data/stay";

type Item = { id: string; src: string; caption: string };

type Props = {
  captions: Record<string, string>;
  hint: string;
  onOpen: (id: string) => void;
};

export function Orbit({ captions, hint, onOpen }: Props) {
  const items: Item[] = orbitShots.map((id) => {
    const shot = shots.find((s) => s.id === id)!;
    return { id, src: shot.src, caption: captions[id] ?? id };
  });
  const n = items.length;
  const step = 360 / n;
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const moved = useRef(0);
  const lastX = useRef(0);
  const visible = useRef(true);
  const [yaw, setYaw] = useState(0);
  const [z, setZ] = useState(220);
  const [front, setFront] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setZ(Math.max(150, Math.min(260, w * 0.32)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry?.isIntersecting ?? true;
    });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = performance.now();
    const tickFrame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      if (!reduce && !drag.current && visible.current) {
        setYaw((y) => y + dt * 0.006);
      }
      frame = requestAnimationFrame(tickFrame);
    };
    frame = requestAnimationFrame(tickFrame);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let best = 0;
    let bestAbs = 999;
    for (let i = 0; i < n; i++) {
      let a = (yaw + i * step) % 360;
      if (a > 180) a -= 360;
      if (a < -180) a += 360;
      const d = Math.abs(a);
      if (d < bestAbs) {
        bestAbs = d;
        best = i;
      }
    }
    setFront(best);
  }, [yaw, n, step]);

  return (
    <div>
      <div
        ref={stageRef}
        className="orbit-stage relative mx-auto h-80 w-full max-w-3xl cursor-grab active:cursor-grabbing sm:h-96"
        onPointerDown={(event) => {
          drag.current = true;
          moved.current = 0;
          lastX.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const dx = event.clientX - lastX.current;
          lastX.current = event.clientX;
          moved.current += Math.abs(dx);
          setYaw((y) => y + dx * 0.45);
        }}
        onPointerUp={() => {
          drag.current = false;
        }}
        onPointerCancel={() => {
          drag.current = false;
        }}
      >
        <div className="orbit-ring" style={{ transform: `rotateY(${yaw}deg)` }}>
          {items.map((item, i) => {
            const active = i === front;
            return (
              <button
                key={item.id}
                type="button"
                className="orbit-card tap overflow-hidden rounded-2xl border border-paper/25 shadow-lg"
                style={{
                  transform: `rotateY(${i * step}deg) translateZ(${z}px)`,
                  opacity: active ? 1 : 0.72,
                }}
                onClick={() => {
                  if (moved.current < 8) onOpen(item.id);
                }}
              >
                <img src={item.src} alt={item.caption} className="h-full w-full object-cover" draggable={false} loading="lazy" />
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-brass-soft" aria-live="polite">
        {items[front]?.caption}
        <span className="mx-2 text-paper/40">·</span>
        <span className="text-paper/70">{hint}</span>
      </p>
    </div>
  );
}
