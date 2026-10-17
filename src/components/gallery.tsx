import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { shots, type ShotCat } from "@/data/stay";
import type { Copy } from "@/i18n/copy";

type Props = {
  copy: Copy;
  captions: Record<string, string>;
  openId: string | null;
  onOpen: (id: string | null) => void;
};

const cats: Array<ShotCat | "all"> = ["all", "outside", "rooms", "food"];

export function Gallery({ copy, captions, openId, onOpen }: Props) {
  const [cat, setCat] = useState<ShotCat | "all">("all");
  const visible = shots.filter((shot) => cat === "all" || shot.cat === cat);
  const openIndex = visible.findIndex((shot) => shot.id === openId);
  const active = openIndex >= 0 ? visible[openIndex] : null;

  useEffect(() => {
    if (openIndex < 0) return;
    const list = visible;
    const index = openIndex;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpen(null);
      if (event.key === "ArrowRight") onOpen(list[(index + 1) % list.length]!.id);
      if (event.key === "ArrowLeft") onOpen(list[(index - 1 + list.length) % list.length]!.id);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // list identity is covered by openId + cat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, cat, openIndex, onOpen]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {cats.map((key) => (
          <button
            key={key}
            type="button"
            className={
              "tap h-11 rounded-full px-4 text-sm " +
              (cat === key ? "bg-ink text-paper" : "border border-line bg-paper text-ink")
            }
            onClick={() => setCat(key)}
          >
            {copy.filters[key]}
          </button>
        ))}
      </div>
      <div className="masonry">
        {visible.map((shot) => (
          <figure key={shot.id} className="mb-3 break-inside-avoid">
            <button
              type="button"
              className="tap block w-full overflow-hidden rounded-2xl text-left"
              onClick={() => onOpen(shot.id)}
            >
              <img src={shot.src} alt={captions[shot.id] ?? shot.id} className="w-full object-cover" loading="lazy" />
              <figcaption className="px-1 pt-2 text-sm text-muted">{captions[shot.id]}</figcaption>
            </button>
          </figure>
        ))}
      </div>
      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={captions[active.id]}
          onClick={() => onOpen(null)}
        >
          <button
            type="button"
            className="tap absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-paper text-ink"
            aria-label={copy.close}
            onClick={() => onOpen(null)}
          >
            <X />
          </button>
          <button
            type="button"
            className="tap absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink"
            aria-label={copy.prev}
            onClick={(event) => {
              event.stopPropagation();
              onOpen(visible[(openIndex - 1 + visible.length) % visible.length]!.id);
            }}
          >
            <ChevronLeft />
          </button>
          <figure className="max-h-[82svh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={active.src}
              alt={captions[active.id]}
              className="max-h-[74svh] w-auto max-w-full rounded-2xl object-contain"
            />
            <figcaption className="pt-3 text-center text-paper">{captions[active.id]}</figcaption>
          </figure>
          <button
            type="button"
            className="tap absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink"
            aria-label={copy.next}
            onClick={(event) => {
              event.stopPropagation();
              onOpen(visible[(openIndex + 1) % visible.length]!.id);
            }}
          >
            <ChevronRight />
          </button>
        </div>
      ) : null}
    </div>
  );
}
