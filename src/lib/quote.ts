import type { Lang } from "@/i18n/copy";
import type { Room, Stay } from "@/data/stay";

export function nightCount(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = Date.parse(`${checkIn}T00:00:00`);
  const b = Date.parse(`${checkOut}T00:00:00`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

export function money(value: number, lang: Lang): string {
  const locale = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";
  const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
  return `${formatted} UZS`;
}

export function nightsLabel(n: number, lang: Lang): string {
  if (lang === "uz") return `${n} kecha`;
  if (lang === "en") return n === 1 ? `${n} night` : `${n} nights`;
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} ночь`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} ночи`;
  return `${n} ночей`;
}

export function guestsLabel(n: number, lang: Lang): string {
  if (lang === "uz") return `${n} mehmon`;
  if (lang === "en") return n === 1 ? `${n} guest` : `${n} guests`;
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} гость`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} гостя`;
  return `${n} гостей`;
}

export type Quote = {
  nights: number;
  total: number | null;
  warning: "split" | "over" | null;
};

export function quoteFor(room: Room, stay: Stay): Quote {
  const nights = nightCount(stay.checkIn, stay.checkOut);
  if (room.price == null) return { nights, total: null, warning: null };
  const billableNights = Math.max(nights, 0);
  if (billableNights === 0) return { nights, total: null, warning: null };
  if (room.unit === "bed") {
    return {
      nights,
      total: room.price * stay.guests * billableNights,
      warning: stay.guests > room.capacity ? "split" : null,
    };
  }
  return {
    nights,
    total: room.price * billableNights,
    warning: stay.guests > room.capacity ? "over" : null,
  };
}
