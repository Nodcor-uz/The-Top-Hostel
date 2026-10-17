import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Ban,
  Car,
  CloudRain,
  Coffee,
  Copy as CopyIcon,
  Lamp,
  MapPin,
  PawPrint,
  Phone,
  Share2,
  TrainFront,
  Trees,
  Utensils,
  VolumeX,
  Wifi,
  Wind,
} from "lucide-react";
import { chime, setMood, tick, type Mood } from "@/lib/ambience";
import { guestsLabel, money, nightsLabel, quoteFor } from "@/lib/quote";
import {
  emptyStay,
  GOOGLE_LINK,
  MAP_EMBED,
  MAP_LINK,
  PHONE_PRETTY,
  PHONE_TEL,
  places,
  rooms,
  themes,
  WHATSAPP,
  type RoomId,
  type Stay,
  type Ticket,
} from "@/data/stay";
import { captions, dict, roomCopy, type Copy, type Lang } from "@/i18n/copy";
import { Gallery } from "@/components/gallery";
import { Orbit } from "@/components/orbit";

const amenityIcons = {
  wifi: Wifi,
  breakfast: Coffee,
  kitchen: Utensils,
  parking: Car,
  air: Wind,
  pets: PawPrint,
  quiet: Ban,
  metro: TrainFront,
} as const;

function buildMessage(copy: Copy, lang: Lang, stay: Stay): string {
  const room = rooms.find((item) => item.id === stay.roomId)!;
  const quote = quoteFor(room, stay);
  const name = roomCopy[lang][stay.roomId].name;
  const estimate =
    quote.total == null
      ? stay.roomId === "twin"
        ? copy.onRequest
        : copy.emptyDates
      : money(quote.total, lang);
  return [
    copy.hello,
    `${copy.name}: ${stay.name.trim()}`,
    `${copy.phone}: ${stay.phone.trim()}`,
    stay.email.trim() ? `${copy.email}: ${stay.email.trim()}` : "",
    `${copy.room}: ${name}`,
    `${copy.guests}: ${stay.guests}`,
    `${copy.searchIn}: ${stay.checkIn}`,
    `${copy.searchOut}: ${stay.checkOut}`,
    quote.nights > 0 ? nightsLabel(quote.nights, lang) : copy.emptyDates,
    `${copy.estimate}: ${estimate}`,
    stay.note.trim() ? `${copy.note}: ${stay.note.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function errorsFor(copy: Copy, stay: Stay): Partial<Record<"name" | "phone" | "email" | "dates", string>> {
  const next: Partial<Record<"name" | "phone" | "email" | "dates", string>> = {};
  if (stay.name.trim().length < 2) next.name = copy.errors.name;
  if (stay.phone.replace(/\D/g, "").length < 7) next.phone = copy.errors.phone;
  if (stay.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stay.email.trim())) next.email = copy.errors.email;
  const nights = quoteFor(rooms[0]!, stay).nights;
  if (!stay.checkIn || !stay.checkOut || nights <= 0) next.dates = copy.errors.dates;
  return next;
}

export function HostelPage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [hydrated, setHydrated] = useState(false);
  const [hour, setHour] = useState<"day" | "night">("day");
  const [mood, setMoodState] = useState<Mood>("off");
  const [stay, setStay] = useState<Stay>(emptyStay);
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone" | "email" | "dates", string>>>({});
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [copied, setCopied] = useState<"addr" | "msg" | "link" | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState(0);

  const copy = dict[lang];
  const caps = captions[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem("th-lang");
    if (savedLang === "uz" || savedLang === "ru" || savedLang === "en") setLang(savedLang);
    const draft = localStorage.getItem("th-draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as Stay;
        setStay({ ...emptyStay(), ...parsed, company: "" });
      } catch {
        /* keep empty */
      }
    } else {
      const start = new Date();
      start.setDate(start.getDate() + 3);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      const iso = (d: Date) => {
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${month}-${day}`;
      };
      setStay((prev) => ({ ...prev, checkIn: iso(start), checkOut: iso(end) }));
    }
    const savedTickets = localStorage.getItem("th-tickets");
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets) as Ticket[]);
      } catch {
        /* ignore */
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("th-lang", lang);
    document.documentElement.lang = lang;
  }, [hydrated, lang]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("th-draft", JSON.stringify({ ...stay, company: "" }));
  }, [hydrated, stay]);

  useEffect(() => () => void setMood("off"), []);

  const nights = quoteFor(rooms[0]!, stay).nights;

  const message = useMemo(() => (ticket ? ticket.message : ""), [ticket]);

  function patch(partial: Partial<Stay>) {
    setStay((prev) => ({ ...prev, ...partial }));
    setTicket(null);
  }

  async function play(next: Mood) {
    setMoodState(next);
    await setMood(next);
    if (next !== "off") tick();
  }

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: copy.brand, text: copy.heroTitle, url });
        return;
      }
    } catch {
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied("link");
    tick();
  }

  async function onCopy(text: string, kind: "addr" | "msg") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    tick();
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (stay.company) return;
    const next = errorsFor(copy, stay);
    setErrors(next);
    if (Object.keys(next).length) return;
    const text = buildMessage(copy, lang, stay);
    const item: Ticket = { id: String(Date.now()), at: new Date().toISOString(), message: text };
    const list = [item, ...tickets].slice(0, 5);
    setTicket(item);
    setTickets(list);
    localStorage.setItem("th-tickets", JSON.stringify(list));
    chime();
  }

  const wa = ticket ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(ticket.message)}` : `https://wa.me/${WHATSAPP}`;

  return (
    <div className="min-h-svh bg-paper text-ink">
      <a href="#rooms" className="sr-only">
        {copy.nav.rooms}
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="#top" className="flex items-center gap-2 text-ink">
            <Mark />
            <span className="font-display text-xl leading-none">The Top</span>
          </a>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-line p-1">
              {(["uz", "ru", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={
                    "tap h-11 min-w-11 rounded-full px-2 text-sm uppercase " +
                    (lang === code ? "bg-ink text-paper" : "text-ink")
                  }
                  onClick={() => {
                    setLang(code);
                    tick();
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="tap grid h-11 w-11 place-items-center rounded-full border border-line"
              aria-label={mood === "off" ? copy.sound.garden : copy.sound.off}
              onClick={() => void play(mood === "off" ? "garden" : "off")}
            >
              {mood === "off" ? <VolumeX size={18} /> : <Trees size={18} />}
            </button>
            <a href="#book" className="tap hidden h-11 items-center rounded-full bg-leaf px-4 text-sm text-paper md:inline-flex">
              {copy.book}
            </a>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 text-sm">
          {(
            [
              ["#house", copy.nav.house],
              ["#rooms", copy.nav.rooms],
              ["#gallery", copy.nav.gallery],
              ["#area", copy.nav.area],
              ["#book", copy.nav.ask],
            ] as const
          ).map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 rounded-full px-3 py-2 text-muted hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="grid lg:grid-cols-12">
          <div className="relative min-h-[52svh] overflow-hidden bg-ink lg:col-span-7 lg:min-h-[88svh]">
            <img
              src="/photos/facade.jpg"
              alt={caps.facade}
              className={"drift absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " + (hour === "day" ? "opacity-100" : "opacity-0")}
            />
            <img
              src="/photos/dusk.jpg"
              alt={caps.dusk}
              className={"drift absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " + (hour === "night" ? "opacity-100" : "opacity-0")}
              loading="lazy"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <HourButton active={hour === "day"} onClick={() => setHour("day")}>
                {copy.day}
              </HourButton>
              <HourButton active={hour === "night"} onClick={() => setHour("night")}>
                {copy.night}
              </HourButton>
            </div>
            <p className="absolute right-4 bottom-4 max-w-xs text-right font-display text-2xl text-paper">{copy.deal}</p>
          </div>
          <div className="flex flex-col justify-between gap-8 bg-paper px-5 py-8 lg:col-span-5 lg:px-10 lg:py-12">
            <div>
              <p className="text-sm tracking-widest text-brass-deep uppercase">{copy.kicker}</p>
              <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{copy.heroTitle}</h1>
              <p className="mt-4 max-w-prose text-lg text-muted">{copy.heroLead}</p>
              <p className="mt-4 flex flex-wrap items-end gap-3">
                <span className="text-sm text-muted">{copy.from}</span>
                <span className="font-display text-4xl tabular-nums text-ink">{money(220730, lang)}</span>
                <span className="text-sm text-muted line-through tabular-nums">{money(289485, lang)}</span>
              </p>
              <p className="mt-3 text-sm text-muted">
                {copy.rating} · {copy.reviews}
              </p>
            </div>
            <form
              className="grid gap-3 rounded-3xl border border-line bg-paper-deep p-4"
              onSubmit={(event) => {
                event.preventDefault();
                document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  {copy.searchIn}
                  <input
                    className="field"
                    type="date"
                    value={stay.checkIn}
                    onChange={(event) => patch({ checkIn: event.target.value })}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.searchOut}
                  <input
                    className="field"
                    type="date"
                    value={stay.checkOut}
                    onChange={(event) => patch({ checkOut: event.target.value })}
                  />
                </label>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">{copy.guests}</span>
                <Stepper
                  value={stay.guests}
                  less={copy.less}
                  more={copy.more}
                  onChange={(guests) => patch({ guests })}
                />
              </div>
              <p className="text-sm text-muted tabular-nums">
                {nights > 0 ? nightsLabel(nights, lang) : copy.addDates}
                <span className="mx-2">·</span>
                {guestsLabel(stay.guests, lang)}
              </p>
              <button type="submit" className="tap h-12 rounded-full bg-leaf text-paper">
                {copy.seeRooms}
              </button>
            </form>
          </div>
        </section>

        <section id="house" className="scroll-mt-28 bg-ink px-5 py-16 text-paper md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm text-brass-soft">01</p>
            <h2 className="mt-2 max-w-xl font-display text-4xl">{copy.orbitTitle}</h2>
            <p className="mt-3 max-w-xl text-paper/80">{copy.orbitLead}</p>
            <div className="mt-8">
              <Orbit captions={caps} hint={copy.orbitHint} onOpen={setOpenId} />
            </div>
            <h3 className="mt-10 font-display text-2xl">{copy.soundTitle}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["garden", Trees, copy.sound.garden, copy.soundLead.garden],
                  ["lantern", Lamp, copy.sound.lantern, copy.soundLead.lantern],
                  ["rain", CloudRain, copy.sound.rain, copy.soundLead.rain],
                ] as const
              ).map(([id, Icon, label, lead]) => (
                <button
                  key={id}
                  type="button"
                  className={
                    "tap rounded-2xl border px-4 py-4 text-left " +
                    (mood === id ? "border-brass bg-leaf text-paper" : "border-paper/20 text-paper")
                  }
                  onClick={() => void play(mood === id ? "off" : id)}
                >
                  <Icon size={18} />
                  <span className="mt-3 block font-display text-xl">{label}</span>
                  <span className="mt-1 block text-sm text-paper/75">{lead}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="rooms" className="scroll-mt-28 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm text-brass-deep">02</p>
            <h2 className="mt-2 font-display text-4xl">{copy.roomsTitle}</h2>
            <p className="mt-3 max-w-2xl text-muted">{copy.roomsLead}</p>
            <p className="mt-2 max-w-2xl text-sm text-muted">{copy.priceNote}</p>
            <div className="mt-8 grid gap-5">
              {rooms.map((room) => {
                const info = roomCopy[lang][room.id];
                const quote = quoteFor(room, stay);
                const active = stay.roomId === room.id;
                return (
                  <article
                    key={room.id}
                    className={
                      "grid overflow-hidden rounded-3xl border bg-paper-deep md:grid-cols-5 " +
                      (active ? "border-leaf" : "border-line")
                    }
                  >
                    <button type="button" className="md:col-span-2" onClick={() => setOpenId(room.id === "bed" ? "dorm" : room.id === "queen" ? "private" : "twin")}>
                      <img src={room.image} alt={info.name} className="h-56 w-full object-cover md:h-full" loading="lazy" />
                    </button>
                    <div className="flex flex-col gap-3 p-5 md:col-span-3 md:p-7">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="font-display text-3xl">{info.name}</h3>
                        {active ? (
                          <span className="rounded-full bg-leaf px-3 py-1 text-sm text-paper">{copy.selected}</span>
                        ) : null}
                      </div>
                      <p className="text-muted">{info.blurb}</p>
                      <p className="text-sm text-brass-deep">
                        {copy.sleeps} {room.capacity} · {info.meta}
                      </p>
                      <p className="font-display text-3xl tabular-nums">
                        {room.price == null ? copy.askDesk : money(room.price, lang)}
                      </p>
                      <p className="text-sm text-muted">
                        {room.unit === "bed" ? copy.perBed : copy.perRoom}
                        {room.was ? (
                          <span className="ml-2 line-through">
                            {copy.was} {money(room.was, lang)}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm">
                        {quote.total != null ? (
                          <>
                            {copy.total}: <span className="tabular-nums">{money(quote.total, lang)}</span>
                            {quote.nights > 0 ? ` · ${nightsLabel(quote.nights, lang)}` : ""}
                          </>
                        ) : room.price == null ? (
                          copy.onRequest
                        ) : (
                          copy.addDates
                        )}
                      </p>
                      {quote.warning === "split" ? <p className="text-sm text-brass-deep">{copy.splitNote}</p> : null}
                      {quote.warning === "over" ? <p className="text-sm text-brass-deep">{copy.overNote}</p> : null}
                      <div className="mt-auto flex flex-wrap gap-2 pt-2">
                        <button
                          type="button"
                          className="tap h-11 rounded-full bg-ink px-4 text-sm text-paper"
                          onClick={() => patch({ roomId: room.id })}
                        >
                          {copy.choose}
                        </button>
                        <a href="#book" className="tap inline-flex h-11 items-center rounded-full border border-line px-4 text-sm">
                          {copy.book}
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-paper-deep px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm text-brass-deep">03</p>
              <h2 className="mt-2 font-display text-4xl">{copy.aboutTitle}</h2>
              {copy.about.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-4 text-muted">
                  {paragraph}
                </p>
              ))}
              <p className="mt-4 text-sm text-ink">
                {copy.checkIn} · {copy.checkOut}
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3 self-end">
              {(Object.keys(amenityIcons) as Array<keyof typeof amenityIcons>).map((key) => {
                const Icon = amenityIcons[key];
                return (
                  <li key={key} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-3">
                    <Icon size={18} />
                    <span className="text-sm">{copy.amenities[key]}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-4xl">{copy.themesTitle}</h2>
            <p className="mt-3 max-w-xl text-muted">{copy.themesLead}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {themes.map((theme) => (
                <li key={theme.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{copy.themes[theme.id]}</span>
                    <span className="tabular-nums text-muted">{theme.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-paper-deep">
                    <div className="h-full rounded-full bg-leaf" style={{ width: `${(theme.count / 37) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-28 px-5 py-4 pb-16 md:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm text-brass-deep">04</p>
            <h2 className="mt-2 font-display text-4xl">{copy.galleryTitle}</h2>
            <p className="mt-3 max-w-2xl text-muted">{copy.galleryLead}</p>
            <p className="mt-2 max-w-2xl text-sm text-muted">{copy.illustrative}</p>
            <div className="mt-6">
              <Gallery copy={copy} captions={caps} openId={openId} onOpen={setOpenId} />
            </div>
          </div>
        </section>

        <section id="area" className="scroll-mt-28 bg-ink px-5 py-16 text-paper md:px-10 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm text-brass-soft">05</p>
              <h2 className="mt-2 font-display text-4xl">{copy.areaTitle}</h2>
              <p className="mt-3 text-paper/75">{copy.areaLead}</p>
              <ul className="mt-6 divide-y divide-paper/15">
                {places.map((place) => (
                  <li key={place.id} className="flex items-baseline justify-between gap-4 py-3">
                    <span>{copy.places[place.id]}</span>
                    <span className="shrink-0 text-sm text-brass-soft tabular-nums">{place.distance}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-start gap-2 text-sm text-paper/80">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>
                  {copy.address}
                  <span className="mt-1 block text-brass-soft">{copy.district}</span>
                </span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={GOOGLE_LINK} className="tap inline-flex h-11 items-center rounded-full bg-paper px-4 text-sm text-ink" target="_blank" rel="noreferrer">
                  {copy.google}
                </a>
                <a href={MAP_LINK} className="tap inline-flex h-11 items-center rounded-full border border-paper/25 px-4 text-sm" target="_blank" rel="noreferrer">
                  {copy.openMap}
                </a>
                <button type="button" className="tap inline-flex h-11 items-center gap-2 rounded-full border border-paper/25 px-4 text-sm" onClick={() => void onCopy(copy.address, "addr")}>
                  <CopyIcon size={16} />
                  {copied === "addr" ? copy.copied : copy.copyAddress}
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-paper/20 bg-paper">
              <iframe title={copy.addressLabel} src={MAP_EMBED} className="h-80 w-full md:h-full md:min-h-96" loading="lazy" />
              <p className="bg-paper px-3 py-2 text-xs text-muted">© OpenStreetMap</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-4xl">{copy.faqTitle}</h2>
            <div className="mt-6 border-t border-line">
              {copy.faq.map((item, index) => {
                const open = faqOpen === index;
                return (
                  <div key={item.q} className="border-b border-line">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                      aria-expanded={open}
                      onClick={() => setFaqOpen(open ? -1 : index)}
                    >
                      <span className="font-display text-xl">{item.q}</span>
                      <span className="text-brass-deep">{open ? "–" : "+"}</span>
                    </button>
                    <div className="fold" data-open={open ? "true" : "false"}>
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-4 text-muted">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="book" className="scroll-mt-28 px-5 pb-28 md:px-10 md:pb-24">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl border border-line bg-paper-deep p-5 md:grid-cols-2 md:p-8">
            <div>
              <p className="text-sm text-brass-deep">06</p>
              <h2 className="mt-2 font-display text-4xl">{copy.formTitle}</h2>
              <p className="mt-3 text-muted">{copy.formLead}</p>
              <p className="mt-4 text-sm text-ink">{copy.noCard}</p>
              <a href={`tel:${PHONE_TEL}`} className="mt-6 inline-flex items-center gap-2 font-display text-2xl">
                <Phone size={18} />
                {PHONE_PRETTY}
              </a>
              <p className="mt-6 text-sm text-muted">{copy.address}</p>
              {tickets.length > 0 ? (
                <div className="mt-8">
                  <h3 className="text-sm text-muted">{copy.tickets}</h3>
                  <ul className="mt-2 grid gap-2">
                    {tickets.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="tap w-full rounded-2xl border border-line bg-paper px-3 py-3 text-left text-sm"
                          onClick={() => setTicket(item)}
                        >
                          {item.message.split("\n").slice(0, 2).join(" · ")}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {ticket ? (
              <div className="rounded-3xl border-l-4 border-brass bg-paper p-5">
                <h3 className="font-display text-3xl">{copy.readyTitle}</h3>
                <p className="mt-2 text-muted">{copy.readyLead}</p>
                <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-paper-deep p-4 text-sm">{message}</pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={wa} target="_blank" rel="noreferrer" className="tap inline-flex h-12 items-center rounded-full bg-leaf px-5 text-paper">
                    {copy.whatsapp}
                  </a>
                  <a href={`tel:${PHONE_TEL}`} className="tap inline-flex h-12 items-center rounded-full border border-line px-5">
                    {copy.call}
                  </a>
                  <button type="button" className="tap inline-flex h-12 items-center gap-2 rounded-full border border-line px-5" onClick={() => void onCopy(message, "msg")}>
                    <CopyIcon size={16} />
                    {copied === "msg" ? copy.copiedMsg : copy.copyMsg}
                  </button>
                </div>
                <button type="button" className="mt-4 text-sm text-brass-deep" onClick={() => setTicket(null)}>
                  {copy.another}
                </button>
              </div>
            ) : (
              <form className="grid gap-3" onSubmit={onSubmit} noValidate>
                <label className="absolute -left-full h-0 w-0 overflow-hidden" aria-hidden="true">
                  {copy.honeypot}
                  <input tabIndex={-1} autoComplete="off" value={stay.company} onChange={(event) => patch({ company: event.target.value })} />
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.name}
                  <input className="field" name="name" autoComplete="name" value={stay.name} placeholder={copy.placeholders.name} onChange={(event) => patch({ name: event.target.value })} aria-invalid={Boolean(errors.name)} />
                  {errors.name ? <span className="text-brass-deep">{errors.name}</span> : null}
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.phone}
                  <input className="field" name="tel" type="tel" inputMode="tel" autoComplete="tel" value={stay.phone} placeholder={copy.placeholders.phone} onChange={(event) => patch({ phone: event.target.value })} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone ? <span className="text-brass-deep">{errors.phone}</span> : null}
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.email}
                  <input className="field" name="email" type="email" autoComplete="email" value={stay.email} placeholder={copy.placeholders.email} onChange={(event) => patch({ email: event.target.value })} aria-invalid={Boolean(errors.email)} />
                  {errors.email ? <span className="text-brass-deep">{errors.email}</span> : null}
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    {copy.searchIn}
                    <input className="field" type="date" value={stay.checkIn} onChange={(event) => patch({ checkIn: event.target.value })} />
                  </label>
                  <label className="grid gap-1 text-sm">
                    {copy.searchOut}
                    <input className="field" type="date" value={stay.checkOut} onChange={(event) => patch({ checkOut: event.target.value })} />
                  </label>
                </div>
                {errors.dates ? <p className="text-sm text-brass-deep">{errors.dates}</p> : null}
                <div className="flex items-center justify-between">
                  <span className="text-sm">{copy.guests}</span>
                  <Stepper value={stay.guests} less={copy.less} more={copy.more} onChange={(guests) => patch({ guests })} />
                </div>
                <label className="grid gap-1 text-sm">
                  {copy.room}
                  <select className="field" value={stay.roomId} onChange={(event) => patch({ roomId: event.target.value as RoomId })}>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {roomCopy[lang][room.id].name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.note}
                  <textarea className="field min-h-24" value={stay.note} placeholder={copy.placeholders.note} onChange={(event) => patch({ note: event.target.value })} />
                </label>
                <button type="submit" className="tap h-12 rounded-full bg-brass text-ink">
                  {copy.send}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl">The Top Hostel</p>
            <p className="text-sm text-muted">{copy.footerNote}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="tap inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm" onClick={() => void onShare()}>
              <Share2 size={16} />
              {copied === "link" ? copy.linkCopied : copy.share}
            </button>
            <a href={`tel:${PHONE_TEL}`} className="tap inline-flex h-11 items-center rounded-full bg-ink px-4 text-sm text-paper">
              {copy.call}
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-paper px-4 py-3 md:hidden">
        <div>
          <p className="text-xs text-muted">{copy.from}</p>
          <p className="font-display text-xl tabular-nums">{money(220730, lang)}</p>
        </div>
        <a href="#book" className="tap inline-flex h-12 items-center rounded-full bg-leaf px-5 text-paper">
          {copy.book}
        </a>
      </div>
    </div>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-leaf" aria-hidden="true">
      <circle cx="16" cy="16" r="14.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 21.5V13.5h10v8M13.2 13.5c.2-2.6 5.4-2.6 5.6 0" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 8.5v2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function HourButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={"tap h-11 rounded-full px-4 text-sm " + (active ? "bg-paper text-ink" : "bg-ink/40 text-paper")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Stepper({
  value,
  onChange,
  less,
  more,
}: {
  value: number;
  onChange: (value: number) => void;
  less: string;
  more: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="tap grid h-11 w-11 place-items-center rounded-full border border-line" aria-label={less} onClick={() => onChange(Math.max(1, value - 1))}>
        –
      </button>
      <span className="w-8 text-center tabular-nums">{value}</span>
      <button type="button" className="tap grid h-11 w-11 place-items-center rounded-full border border-line" aria-label={more} onClick={() => onChange(Math.min(12, value + 1))}>
        +
      </button>
    </div>
  );
}
