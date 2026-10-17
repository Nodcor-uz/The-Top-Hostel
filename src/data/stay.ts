export const PHONE_TEL = "+998994409944";
export const PHONE_PRETTY = "+998 99 440 99 44";
export const WHATSAPP = "998994409944";
export const LAT = 41.32453;
export const LON = 69.31793;

export const MAP_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=69.308%2C41.318%2C69.328%2C41.331&layer=mapnik&marker=${LAT}%2C${LON}`;
export const MAP_LINK = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=17/${LAT}/${LON}`;
export const GOOGLE_LINK = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LON}`;

export type RoomId = "bed" | "queen" | "twin";

export type Room = {
  id: RoomId;
  price: number | null;
  was: number | null;
  unit: "bed" | "room";
  capacity: number;
  image: string;
};

export const rooms: Room[] = [
  {
    id: "bed",
    price: 220730,
    was: 289485,
    unit: "bed",
    capacity: 8,
    image: "/photos/dorm.jpg",
  },
  {
    id: "queen",
    price: 375728,
    was: null,
    unit: "room",
    capacity: 4,
    image: "/photos/private.jpg",
  },
  {
    id: "twin",
    price: null,
    was: null,
    unit: "room",
    capacity: 2,
    image: "/photos/twin.jpg",
  },
];

export type ShotCat = "outside" | "rooms" | "food";

export type Shot = { id: string; src: string; cat: ShotCat };

export const shots: Shot[] = [
  { id: "facade", src: "/photos/facade.jpg", cat: "outside" },
  { id: "dusk", src: "/photos/dusk.jpg", cat: "outside" },
  { id: "garden", src: "/photos/garden.jpg", cat: "outside" },
  { id: "dorm", src: "/photos/dorm.jpg", cat: "rooms" },
  { id: "private", src: "/photos/private.jpg", cat: "rooms" },
  { id: "twin", src: "/photos/twin.jpg", cat: "rooms" },
  { id: "lounge", src: "/photos/lounge.jpg", cat: "rooms" },
  { id: "bath", src: "/photos/bath.jpg", cat: "rooms" },
  { id: "kitchen", src: "/photos/kitchen.jpg", cat: "food" },
  { id: "breakfast", src: "/photos/breakfast.jpg", cat: "food" },
];

export const orbitShots = ["facade", "dorm", "private", "kitchen", "garden", "lounge"] as const;

export const themes = [
  { id: "staff", count: 37 },
  { id: "clean", count: 23 },
  { id: "cozy", count: 14 },
  { id: "pleasant", count: 9 },
  { id: "metro", count: 6 },
  { id: "responsive", count: 4 },
] as const;

export const places = [
  { id: "pushkin", distance: "9 min · 663 m" },
  { id: "buyuk", distance: "910 m" },
  { id: "zoo", distance: "4 km" },
  { id: "amir", distance: "4 km" },
  { id: "chorsu", distance: "8 km" },
  { id: "airport", distance: "8 km" },
  { id: "eko", distance: "" },
] as const;

export type Stay = {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: RoomId;
  name: string;
  phone: string;
  email: string;
  note: string;
  company: string;
};

export type Ticket = {
  id: string;
  at: string;
  message: string;
};

export const emptyStay = (): Stay => ({
  checkIn: "",
  checkOut: "",
  guests: 2,
  roomId: "bed",
  name: "",
  phone: "",
  email: "",
  note: "",
  company: "",
});
