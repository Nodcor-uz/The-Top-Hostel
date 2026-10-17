import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ChevronRight, a as Utensils, b as Ban, c as TrainFront, d as PawPrint, f as MapPin, g as CloudRain, h as Coffee, i as VolumeX, l as Share2, m as Copy, n as Wind, p as Lamp, r as Wifi, s as Trees, t as X, u as Phone, v as ChevronLeft, y as Car } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-95mRAd_U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var engine = null;
function audio() {
	if (!ctx) ctx = new AudioContext();
	return ctx;
}
function loopNoise(c, color) {
	const length = c.sampleRate * 2;
	const buffer = c.createBuffer(1, length, c.sampleRate);
	const data = buffer.getChannelData(0);
	let last = 0;
	for (let i = 0; i < length; i++) {
		const white = Math.random() * 2 - 1;
		if (color === "white") data[i] = white;
		else {
			last = (last + .02 * white) / 1.02;
			data[i] = last * 3.2;
		}
	}
	const src = c.createBufferSource();
	src.buffer = buffer;
	src.loop = true;
	return src;
}
function chirp(c, dest) {
	const osc = c.createOscillator();
	const gain = c.createGain();
	const freq = 1600 + Math.random() * 2400;
	osc.type = "sine";
	osc.frequency.setValueAtTime(freq, c.currentTime);
	osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * (1.15 + Math.random() * .35)), c.currentTime + .09);
	gain.gain.setValueAtTime(1e-4, c.currentTime);
	gain.gain.linearRampToValueAtTime(.028, c.currentTime + .02);
	gain.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + .16);
	osc.connect(gain).connect(dest);
	osc.start();
	osc.stop(c.currentTime + .18);
}
function startGarden(c) {
	const master = c.createGain();
	master.gain.value = .9;
	master.connect(c.destination);
	const noise = loopNoise(c, "brown");
	const filter = c.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = 700;
	const gain = c.createGain();
	gain.gain.value = .045;
	noise.connect(filter).connect(gain).connect(master);
	noise.start();
	let timer = 0;
	const schedule = () => {
		chirp(c, master);
		timer = window.setTimeout(schedule, 700 + Math.random() * 1600);
	};
	timer = window.setTimeout(schedule, 400);
	return { stop: () => {
		window.clearTimeout(timer);
		noise.stop();
		master.disconnect();
	} };
}
function startLantern(c) {
	const master = c.createGain();
	master.gain.value = .03;
	master.connect(c.destination);
	const lfo = c.createOscillator();
	const lfoGain = c.createGain();
	lfo.frequency.value = .07;
	lfoGain.gain.value = .012;
	lfo.connect(lfoGain).connect(master.gain);
	lfo.start();
	const nodes = [];
	for (const freq of [
		196,
		246.9,
		392
	]) {
		const osc = c.createOscillator();
		osc.type = "sine";
		osc.frequency.value = freq;
		const gain = c.createGain();
		gain.gain.value = freq > 300 ? .25 : .55;
		osc.connect(gain).connect(master);
		osc.start();
		nodes.push(osc);
	}
	return { stop: () => {
		lfo.stop();
		for (const osc of nodes) osc.stop();
		master.disconnect();
	} };
}
function startRain(c) {
	const master = c.createGain();
	master.gain.value = .22;
	master.connect(c.destination);
	const noise = loopNoise(c, "white");
	const filter = c.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.value = 1400;
	filter.Q.value = .55;
	noise.connect(filter).connect(master);
	noise.start();
	const rumble = loopNoise(c, "brown");
	const low = c.createBiquadFilter();
	low.type = "lowpass";
	low.frequency.value = 240;
	const lowGain = c.createGain();
	lowGain.gain.value = .35;
	rumble.connect(low).connect(lowGain).connect(master);
	rumble.start();
	return { stop: () => {
		noise.stop();
		rumble.stop();
		master.disconnect();
	} };
}
async function setMood(next) {
	const c = audio();
	if (c.state === "suspended") await c.resume();
	engine?.stop();
	engine = null;
	if (next === "garden") engine = startGarden(c);
	if (next === "lantern") engine = startLantern(c);
	if (next === "rain") engine = startRain(c);
}
function tick() {
	const c = audio();
	if (c.state === "suspended") c.resume();
	const osc = c.createOscillator();
	const gain = c.createGain();
	osc.type = "sine";
	osc.frequency.value = 680;
	gain.gain.setValueAtTime(.035, c.currentTime);
	gain.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + .06);
	osc.connect(gain).connect(c.destination);
	osc.start();
	osc.stop(c.currentTime + .07);
}
function chime() {
	const c = audio();
	if (c.state === "suspended") c.resume();
	[
		523.25,
		659.25,
		783.99
	].forEach((freq, i) => {
		const osc = c.createOscillator();
		const gain = c.createGain();
		osc.type = "sine";
		osc.frequency.value = freq;
		const t = c.currentTime + i * .09;
		gain.gain.setValueAtTime(1e-4, t);
		gain.gain.linearRampToValueAtTime(.04, t + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, t + .35);
		osc.connect(gain).connect(c.destination);
		osc.start(t);
		osc.stop(t + .36);
	});
}
function nightCount(checkIn, checkOut) {
	if (!checkIn || !checkOut) return 0;
	const a = Date.parse(`${checkIn}T00:00:00`);
	const b = Date.parse(`${checkOut}T00:00:00`);
	if (Number.isNaN(a) || Number.isNaN(b)) return 0;
	return Math.round((b - a) / 864e5);
}
function money(value, lang) {
	const locale = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";
	return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)} UZS`;
}
function nightsLabel(n, lang) {
	if (lang === "uz") return `${n} kecha`;
	if (lang === "en") return n === 1 ? `${n} night` : `${n} nights`;
	const m10 = n % 10;
	const m100 = n % 100;
	if (m10 === 1 && m100 !== 11) return `${n} ночь`;
	if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} ночи`;
	return `${n} ночей`;
}
function guestsLabel(n, lang) {
	if (lang === "uz") return `${n} mehmon`;
	if (lang === "en") return n === 1 ? `${n} guest` : `${n} guests`;
	const m10 = n % 10;
	const m100 = n % 100;
	if (m10 === 1 && m100 !== 11) return `${n} гость`;
	if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} гостя`;
	return `${n} гостей`;
}
function quoteFor(room, stay) {
	const nights = nightCount(stay.checkIn, stay.checkOut);
	if (room.price == null) return {
		nights,
		total: null,
		warning: null
	};
	const billableNights = Math.max(nights, 0);
	if (billableNights === 0) return {
		nights,
		total: null,
		warning: null
	};
	if (room.unit === "bed") return {
		nights,
		total: room.price * stay.guests * billableNights,
		warning: stay.guests > room.capacity ? "split" : null
	};
	return {
		nights,
		total: room.price * billableNights,
		warning: stay.guests > room.capacity ? "over" : null
	};
}
var PHONE_TEL = "+998994409944";
var PHONE_PRETTY = "+998 99 440 99 44";
var WHATSAPP = "998994409944";
var LAT = 41.32453;
var LON = 69.31793;
var MAP_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=69.308%2C41.318%2C69.328%2C41.331&layer=mapnik&marker=${LAT}%2C${LON}`;
var MAP_LINK = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=17/${LAT}/${LON}`;
var GOOGLE_LINK = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LON}`;
var rooms = [
	{
		id: "bed",
		price: 220730,
		was: 289485,
		unit: "bed",
		capacity: 8,
		image: "/photos/dorm.jpg"
	},
	{
		id: "queen",
		price: 375728,
		was: null,
		unit: "room",
		capacity: 4,
		image: "/photos/private.jpg"
	},
	{
		id: "twin",
		price: null,
		was: null,
		unit: "room",
		capacity: 2,
		image: "/photos/twin.jpg"
	}
];
var shots = [
	{
		id: "facade",
		src: "/photos/facade.jpg",
		cat: "outside"
	},
	{
		id: "dusk",
		src: "/photos/dusk.jpg",
		cat: "outside"
	},
	{
		id: "garden",
		src: "/photos/garden.jpg",
		cat: "outside"
	},
	{
		id: "dorm",
		src: "/photos/dorm.jpg",
		cat: "rooms"
	},
	{
		id: "private",
		src: "/photos/private.jpg",
		cat: "rooms"
	},
	{
		id: "twin",
		src: "/photos/twin.jpg",
		cat: "rooms"
	},
	{
		id: "lounge",
		src: "/photos/lounge.jpg",
		cat: "rooms"
	},
	{
		id: "bath",
		src: "/photos/bath.jpg",
		cat: "rooms"
	},
	{
		id: "kitchen",
		src: "/photos/kitchen.jpg",
		cat: "food"
	},
	{
		id: "breakfast",
		src: "/photos/breakfast.jpg",
		cat: "food"
	}
];
var orbitShots = [
	"facade",
	"dorm",
	"private",
	"kitchen",
	"garden",
	"lounge"
];
var themes = [
	{
		id: "staff",
		count: 37
	},
	{
		id: "clean",
		count: 23
	},
	{
		id: "cozy",
		count: 14
	},
	{
		id: "pleasant",
		count: 9
	},
	{
		id: "metro",
		count: 6
	},
	{
		id: "responsive",
		count: 4
	}
];
var places = [
	{
		id: "pushkin",
		distance: "9 min · 663 m"
	},
	{
		id: "buyuk",
		distance: "910 m"
	},
	{
		id: "zoo",
		distance: "4 km"
	},
	{
		id: "amir",
		distance: "4 km"
	},
	{
		id: "chorsu",
		distance: "8 km"
	},
	{
		id: "airport",
		distance: "8 km"
	},
	{
		id: "eko",
		distance: ""
	}
];
var emptyStay = () => ({
	checkIn: "",
	checkOut: "",
	guests: 2,
	roomId: "bed",
	name: "",
	phone: "",
	email: "",
	note: "",
	company: ""
});
var dict = {
	uz: {
		brand: "The Top Hostel",
		kicker: "Mirzo Ulugʻbek · Toshkent",
		heroTitle: "Chinorlar soyasidagi tinch yotoq.",
		heroLead: "Mustaqillik shoh koʻchasidagi oddiy hostel. Pushkin metrosigacha 9 daqiqa, oshxona, yengil nonushta va shahar shovqini eshik ortida qoladigan joy.",
		deal: "Yotoqqa −24%",
		priceNote: "Ochiq narxda yotoq 289 485 UZS dan 220 730 gacha tushgan. Jonli narxni yozishmada tasdiqlaymiz — bu sahifada karta yechilmaydi.",
		from: "Dan",
		reviews: "191 ochiq sharh",
		rating: "4,3",
		book: "Ariza qoldirish",
		call: "Qoʻngʻiroq",
		whatsapp: "WhatsApp",
		nav: {
			house: "Uy",
			rooms: "Xonalar",
			gallery: "Galereya",
			area: "Atrof",
			ask: "Ariza"
		},
		searchIn: "Kirish",
		searchOut: "Chiqish",
		guests: "Mehmonlar",
		seeRooms: "Xonalarni koʻrish",
		less: "Kamroq mehmon",
		more: "Koʻproq mehmon",
		orbitTitle: "Uyni aylantiring",
		orbitLead: "Halqani suring. Tunashning olti tomoni — koʻcha, yotoqlar, oshxona, bogʻ.",
		orbitHint: "Yon tomonga suring",
		soundTitle: "Koʻchani yoqing",
		sound: {
			off: "Jim",
			garden: "Bogʻ",
			lantern: "Chiroqlar",
			rain: "Yomgʻir"
		},
		soundLead: {
			garden: "Ertalabki barglar va qushlar.",
			lantern: "Kechki past gʻuvillash.",
			rain: "Chinorlardagi yomgʻir."
		},
		roomsTitle: "Qayerda uxlaymiz",
		roomsLead: "Umumiy xonalar 2–8 kishilik. Baʼzi narvon-yotoqlarda parda bor. Hojatxona umumiy.",
		was: "edi",
		total: "Taxmin",
		onRequest: "Narxni javobda yozamiz",
		choose: "Shu sanalarni olish",
		selected: "Tanlandi",
		splitNote: "8 tadan koʻp yotoq — xonalarga boʻlib joylaymiz.",
		overNote: "Bu xonada joy kamroq. Izohga dorm yozing yoki umumiy yotoqni tanlang.",
		addDates: "Summani koʻrish uchun sanalarni qoʻying.",
		perBed: "yotoq / kecha",
		perRoom: "xona / kecha",
		illustrative: "Kadrlar uyning badiiy chizmalari, jonli suratlar emas. Xona bugun qanday — WhatsAppda soʻrang.",
		aboutTitle: "Qisqasi",
		about: ["Uy Mirzo Ulugʻbekning yashil qismida, Pushkin metrosiga yaqin. Hayvonot bogʻi va Amir Temur maydonigacha taxminan 4 km, Chorsu bozorigacha taxminan 8 km.", "Yotoq yoki alohida xona, Wi-Fi, yengil nonushta va stolli oshxona. Kirish 13:00, chiqish 12:00."],
		amenityTitle: "Uyda",
		amenities: {
			wifi: "Bepul Wi-Fi",
			breakfast: "Yengil nonushta",
			kitchen: "Umumiy oshxona",
			parking: "Bepul avtoturargoh",
			air: "Konditsioner",
			pets: "Uy hayvoni bilan mumkin",
			quiet: "Chekishsiz",
			metro: "Metrogacha 9 daqiqa"
		},
		themesTitle: "Mehmonlar nima deydi",
		themesLead: "191 ochiq sharhdagi mavzular. Xarita bahosi 4,3.",
		themes: {
			staff: "Yordamchi xodimlar",
			clean: "Tozalik",
			cozy: "Shinamlik",
			pleasant: "Yoqimli xodimlar",
			metro: "Metro yaqin",
			responsive: "Tez javob"
		},
		galleryTitle: "Atrofga nazar",
		galleryLead: "Tashqari, xonalar va dasturxon. Kadrni bosing.",
		filters: {
			all: "Barchasi",
			outside: "Tashqari",
			rooms: "Xonalar",
			food: "Dasturxon"
		},
		areaTitle: "Shoh koʻcha atrofi",
		areaLead: "Masofalar ochiq xaritalardan — piyoda va yoʻl biroz farq qiladi.",
		places: {
			pushkin: "Pushkin metrosi",
			buyuk: "Buyuk Ipak yoʻli metrosi",
			zoo: "Toshkent hayvonot bogʻi",
			amir: "Amir Temur maydoni",
			chorsu: "Chorsu bozori",
			airport: "Toshkent aeroporti",
			eko: "Ekopark veloyoʻlaklari, shu tumanda"
		},
		openMap: "OpenStreetMap",
		google: "Yoʻl",
		copyAddress: "Manzilni nusxalash",
		copied: "Nusxalandi",
		directions: "Mustaqillik 63",
		faqTitle: "Yozishdan oldin",
		faq: [
			{
				q: "Qachon kiraman va chiqaman?",
				a: "Kirish 13:00, chiqish 12:00. Avvalroq kelsangiz, yozing — yotoq boʻshligini aytamiz."
			},
			{
				q: "Hojatxona alohidami?",
				a: "Umumiy xonalarda hojatxona umumiy. Baʼzi yotoqlarda parda bor. Alohida xonalarda hojatxonani javobda tasdiqlaymiz."
			},
			{
				q: "Nonushta kiradimi?",
				a: "Yengil nonushta kiradi. Pishirmoqchi boʻlsangiz oshxona bor. Bu toʻliq restoran emas."
			},
			{
				q: "Bekor qilsam boʻladimi?",
				a: "Ochiq takliflarda koʻpincha kelishdan bir-ikki kun oldin bepul bekor qilish bor. Sanalaringizga toʻlovdan oldin aniq javob beramiz."
			},
			{
				q: "Hayvon, turargoh, aeroport?",
				a: "Uy hayvoni bilan mumkin, turargoh bepul. Aeroport taxminan 8 km. Transferni vaʼda qilmaymiz — kutib olish kerak boʻlsa, soʻrang."
			},
			{
				q: "Ariza qanday ishlaydi?",
				a: "Sahifa kartadan pul yechmaydi. U WhatsApp yoki qoʻngʻiroq uchun xabar yigʻadi. Xona va narxni tasdiqlaymiz, keyin kelishilganicha toʻlov."
			}
		],
		formTitle: "Xona soʻrash",
		formLead: "Sanalarni yozing. WhatsApp yoki telefonda javob beramiz.",
		name: "Ism",
		phone: "Telefon",
		email: "Pochta, xohlasangiz",
		note: "Izoh",
		room: "Xona",
		placeholders: {
			name: "Ismingiz",
			phone: "+998 …",
			email: "you@email.com",
			note: "Kechki reys, velosiped, tinch yotoq…"
		},
		errors: {
			name: "Ism yozing.",
			phone: "Kamida 7 raqamli telefon kerak.",
			email: "Pochta toʻliq emas.",
			dates: "Chiqish kirishdan keyin boʻlishi kerak."
		},
		send: "Xabarni yigʻish",
		readyTitle: "Yuborishga tayyor",
		readyLead: "Toʻlov olinmadi. Matnni stolda yuboring — yotoqni ular tasdiqlaydi.",
		copyMsg: "Matnni nusxalash",
		copiedMsg: "Matn nusxalandi",
		another: "Arizani tahrirlash",
		yourNotes: "Shu qurilmada",
		day: "Kun",
		night: "Tun",
		checkIn: "Kirish 13:00",
		checkOut: "Chiqish 12:00",
		addressLabel: "Manzil",
		address: "Mustaqillik shoh koʻchasi 63, Mirzo Ulugʻbek tumani, Toshkent 100192, Oʻzbekiston",
		footerNote: "The Top Hostel · Pushkin metrosi yonidagi yashil tunash.",
		share: "Ulashish",
		linkCopied: "Havola nusxalandi",
		close: "Yopish",
		next: "Keyingi",
		prev: "Oldingi",
		hoursIn: "13:00",
		hoursOut: "12:00",
		noCard: "Bu yerda karta yoʻq",
		estimate: "Taxmin",
		hello: "Assalomu alaykum, The Top Hostel — tunamoqchiman.",
		tickets: "Shu telefondagi arizalar",
		emptyDates: "Sanalar hali yoʻq",
		sleeps: "Joy",
		askDesk: "Stolda aniqlaymiz",
		district: "Plyus-kod 88G9+3G",
		resend: "Qayta yuborish",
		honeypot: "Kompaniya"
	},
	ru: {
		brand: "The Top Hostel",
		kicker: "Мирзо-Улугбек · Ташкент",
		heroTitle: "Тихая кровать в тени чинар.",
		heroLead: "Простой хостел на проспекте Мустакиллик. Девять минут пешком от метро Пушкина, кухня, лёгкий завтрак и место, где город остаётся за дверью.",
		deal: "−24% на кровать",
		priceNote: "В открытом прайсе кровать была 289 485 UZS и упала до 220 730. Живую цену подтверждаем в переписке — на этой странице карта не списывается.",
		from: "От",
		reviews: "191 публичный отзыв",
		rating: "4,3",
		book: "Оставить заявку",
		call: "Позвонить",
		whatsapp: "WhatsApp",
		nav: {
			house: "Дом",
			rooms: "Комнаты",
			gallery: "Галерея",
			area: "Рядом",
			ask: "Заявка"
		},
		searchIn: "Заезд",
		searchOut: "Выезд",
		guests: "Гости",
		seeRooms: "Смотреть комнаты",
		less: "Меньше гостей",
		more: "Больше гостей",
		orbitTitle: "Покрутите дом",
		orbitLead: "Потяните кольцо. Шесть сторон ночлега — улица, кровати, кухня, сад.",
		orbitHint: "Тяните в сторону",
		soundTitle: "Включите улицу",
		sound: {
			off: "Тихо",
			garden: "Сад",
			lantern: "Фонари",
			rain: "Дождь"
		},
		soundLead: {
			garden: "Утренние листья и птицы.",
			lantern: "Низкий вечерний гул.",
			rain: "Дождь по чинарам."
		},
		roomsTitle: "Где спать",
		roomsLead: "Общие комнаты на 2–8 человек. На некоторых двухъярусных кроватях есть шторка. Санузел общий.",
		was: "было",
		total: "Оценка",
		onRequest: "Цену напишем в ответе",
		choose: "Взять эти даты",
		selected: "Выбрано",
		splitNote: "Больше 8 мест — расселим по комнатам.",
		overNote: "В этой комнате меньше мест. Допишите дорм в заметке или возьмите кровать в общей.",
		addDates: "Поставьте даты, чтобы увидеть сумму.",
		perBed: "за кровать / ночь",
		perRoom: "за комнату / ночь",
		illustrative: "Кадры — художественные наброски дома, не прямая съёмка номеров. Как выглядит комната сегодня, спросите в WhatsApp.",
		aboutTitle: "Без лишних слов",
		about: ["Дом стоит в зелёной части Мирзо-Улугбека, рядом с метро Пушкина. До зоопарка и площади Амира Темура около 4 км, до Чорсу около 8 км.", "Кровать или отдельная комната, Wi-Fi, лёгкий завтрак и кухня со столом. Заезд в 13:00, выезд в 12:00."],
		amenityTitle: "В доме",
		amenities: {
			wifi: "Бесплатный Wi-Fi",
			breakfast: "Лёгкий завтрак",
			kitchen: "Общая кухня",
			parking: "Бесплатная парковка",
			air: "Кондиционер",
			pets: "Можно с питомцем",
			quiet: "Без курения",
			metro: "9 минут до метро"
		},
		themesTitle: "О чём пишут гости",
		themesLead: "Темы из 191 публичного отзыва. На картах оценка 4,3.",
		themes: {
			staff: "Отзывчивые сотрудники",
			clean: "Чистота",
			cozy: "Уют",
			pleasant: "Приятные хозяева",
			metro: "Метро рядом",
			responsive: "Быстрые ответы"
		},
		galleryTitle: "Посмотреть",
		galleryLead: "Улица, комнаты и стол. Нажмите на кадр.",
		filters: {
			all: "Все",
			outside: "Снаружи",
			rooms: "Комнаты",
			food: "Стол"
		},
		areaTitle: "Вокруг проспекта",
		areaLead: "Расстояния из открытых карт — пешком и по дороге чуть иначе.",
		places: {
			pushkin: "Метро Пушкина",
			buyuk: "Метро Буюк Ипак Йули",
			zoo: "Ташкентский зоопарк",
			amir: "Площадь Амира Темура",
			chorsu: "Базар Чорсу",
			airport: "Аэропорт Ташкента",
			eko: "Велодорожки Экопарка, в этом районе"
		},
		openMap: "OpenStreetMap",
		google: "Маршрут",
		copyAddress: "Скопировать адрес",
		copied: "Скопировано",
		directions: "Мустакиллик 63",
		faqTitle: "Перед заявкой",
		faq: [
			{
				q: "Когда заезд и выезд?",
				a: "Заезд в 13:00, выезд в 12:00. Если прилетаете раньше — напишите, скажем, свободна ли кровать."
			},
			{
				q: "Санузел свой?",
				a: "В общих комнатах санузел общий. На части кроватей есть шторка. По отдельным номерам подтверждаем санузел в ответе."
			},
			{
				q: "Завтрак входит?",
				a: "Лёгкий завтрак входит. Есть кухня, если хотите готовить. Это не полноценный ресторан."
			},
			{
				q: "Можно отменить?",
				a: "В открытых предложениях часто есть бесплатная отмена за день-два до заезда. По вашим датам ответим ясно до оплаты."
			},
			{
				q: "Животные, парковка, аэропорт?",
				a: "С питомцами можно, парковка бесплатная. Аэропорт примерно в 8 км. Трансфер не обещаем — спросите, если нужна встреча."
			},
			{
				q: "Как работает заявка?",
				a: "Страница не снимает деньги с карты. Она собирает сообщение для WhatsApp или звонка. Мы подтверждаем комнату и цену, потом оплата как договоримся."
			}
		],
		formTitle: "Запросить комнату",
		formLead: "Напишите даты. Отвечаем в WhatsApp или по телефону, пока стойка на месте.",
		name: "Имя",
		phone: "Телефон",
		email: "Почта, если хотите",
		note: "Заметка",
		room: "Комната",
		placeholders: {
			name: "Как к вам обращаться",
			phone: "+998 …",
			email: "you@email.com",
			note: "Поздний рейс, велосипед, тихая кровать…"
		},
		errors: {
			name: "Напишите имя.",
			phone: "Нужен телефон хотя бы из 7 цифр.",
			email: "Почта выглядит неполной.",
			dates: "Выезд должен быть позже заезда."
		},
		send: "Собрать сообщение",
		readyTitle: "Можно отправлять",
		readyLead: "Оплаты не было. Отправьте текст на стойку — там подтвердят кровать.",
		copyMsg: "Скопировать текст",
		copiedMsg: "Текст скопирован",
		another: "Изменить заявку",
		yourNotes: "На этом устройстве",
		day: "День",
		night: "Ночь",
		checkIn: "Заезд 13:00",
		checkOut: "Выезд 12:00",
		addressLabel: "Адрес",
		address: "проспект Мустакиллик 63, Мирзо-Улугбекский район, Ташкент 100192, Узбекистан",
		footerNote: "The Top Hostel · зелёный ночлег у метро Пушкина.",
		share: "Поделиться",
		linkCopied: "Ссылка скопирована",
		close: "Закрыть",
		next: "Дальше",
		prev: "Назад",
		hoursIn: "13:00",
		hoursOut: "12:00",
		noCard: "Карту здесь не просим",
		estimate: "Оценка",
		hello: "Здравствуйте, The Top Hostel — хочу остановиться.",
		tickets: "Заявки на этом телефоне",
		emptyDates: "Даты ещё не выбраны",
		sleeps: "Мест",
		askDesk: "Уточним на стойке",
		district: "Плюс-код 88G9+3G",
		resend: "Отправить снова",
		honeypot: "Компания"
	},
	en: {
		brand: "The Top Hostel",
		kicker: "Mirzo Ulugbek · Tashkent",
		heroTitle: "A quiet bed in the shade of plane trees.",
		heroLead: "A straightforward hostel on Mustaqillik Avenue. Nine minutes on foot from Pushkin metro, with a kitchen, a light breakfast, and room to leave the city noise outside.",
		deal: "−24% on a bed",
		priceNote: "A public listing showed 289,485 UZS crossed down to 220,730 for a bed. We confirm the live rate when you write — nothing is charged on this page.",
		from: "From",
		reviews: "191 public reviews",
		rating: "4.3",
		book: "Request a bed",
		call: "Call",
		whatsapp: "WhatsApp",
		nav: {
			house: "The house",
			rooms: "Rooms",
			gallery: "Gallery",
			area: "Around",
			ask: "Request"
		},
		searchIn: "Check in",
		searchOut: "Check out",
		guests: "Guests",
		seeRooms: "See rooms",
		less: "Fewer guests",
		more: "More guests",
		orbitTitle: "Turn the house",
		orbitLead: "Drag the ring. Six corners of the stay — outside, beds, kitchen, garden.",
		orbitHint: "Drag sideways",
		soundTitle: "Put the street on",
		sound: {
			off: "Quiet",
			garden: "Garden",
			lantern: "Lanterns",
			rain: "Rain"
		},
		soundLead: {
			garden: "Morning leaves and a few birds.",
			lantern: "A low evening hum.",
			rain: "Rain in the plane trees."
		},
		roomsTitle: "Where you sleep",
		roomsLead: "Dorms hold 2 to 8 guests. Some bunks have privacy curtains. Bathrooms are shared.",
		was: "was",
		total: "Estimate",
		onRequest: "Price when we reply",
		choose: "Use these dates",
		selected: "Selected",
		splitNote: "More than 8 beds — we will split you across rooms.",
		overNote: "This room sleeps fewer people. Add a dorm bed in the note, or pick the shared bed.",
		addDates: "Add dates to see a total.",
		perBed: "per bed / night",
		perRoom: "per room / night",
		illustrative: "These frames are illustrative studies of the house, not a live photo set. Ask on WhatsApp for how the room looks today.",
		aboutTitle: "The stay, plainly",
		about: ["The house sits in a leafy part of Mirzo Ulugbek, a short walk from Pushkin metro. Tashkent Zoo and Amir Temur Square are about 4 km away; Chorsu Bazaar is about 8 km.", "You get a bed or a private room, Wi-Fi, a light breakfast, and a kitchen with a table. Check-in is 1:00 PM, check-out is 12:00 PM."],
		amenityTitle: "In the house",
		amenities: {
			wifi: "Free Wi-Fi",
			breakfast: "Light breakfast",
			kitchen: "Shared kitchen",
			parking: "Free parking",
			air: "Air conditioning",
			pets: "Pets welcome",
			quiet: "Smoke-free",
			metro: "9 min to metro"
		},
		themesTitle: "What guests mention",
		themesLead: "Themes from 191 public reviews. The score on listings is 4.3.",
		themes: {
			staff: "Helpful staff",
			clean: "Cleanliness",
			cozy: "Cozy feel",
			pleasant: "Pleasant staff",
			metro: "Metro access",
			responsive: "Quick replies"
		},
		galleryTitle: "Look around",
		galleryLead: "Outside, rooms, and the table. Tap a frame.",
		filters: {
			all: "All",
			outside: "Outside",
			rooms: "Rooms",
			food: "Table"
		},
		areaTitle: "Around the avenue",
		areaLead: "Distances are the public ones — walking and roads differ a little.",
		places: {
			pushkin: "Pushkin metro",
			buyuk: "Buyuk Ipak Yoli metro",
			zoo: "Tashkent Zoo",
			amir: "Amir Temur Square",
			chorsu: "Chorsu Bazaar",
			airport: "Tashkent airport",
			eko: "Ekopark bike trails, in the district"
		},
		openMap: "OpenStreetMap",
		google: "Directions",
		copyAddress: "Copy address",
		copied: "Copied",
		directions: "Mustaqillik 63",
		faqTitle: "Before you write",
		faq: [
			{
				q: "When can I arrive and leave?",
				a: "Check-in is 1:00 PM. Check-out is 12:00 PM. If you land earlier, say so — we will tell you if the bed is free."
			},
			{
				q: "Are the bathrooms private?",
				a: "Dorms use shared bathrooms. Some bunks have privacy curtains. For the private rooms, we confirm the bathroom when we reply."
			},
			{
				q: "Is breakfast included?",
				a: "A light breakfast is part of the stay, and there is a kitchen if you want to cook. It is not a full restaurant."
			},
			{
				q: "Can I cancel?",
				a: "Public offers often allow free cancellation until a day or two before arrival. Your dates get a clear yes or no in the chat before you pay."
			},
			{
				q: "Pets, parking, airport?",
				a: "Pets are welcome and parking is free. The airport is about 8 km. We do not promise a shuttle — ask if you need a pickup."
			},
			{
				q: "How does a request work?",
				a: "This page does not take a card. It writes a message you send on WhatsApp or by phone. We confirm the room and the rate, then you pay as agreed."
			}
		],
		formTitle: "Ask for the room",
		formLead: "Tell us the dates. We answer on WhatsApp or by phone, usually while the desk is awake.",
		name: "Name",
		phone: "Phone",
		email: "Email, if you want",
		note: "Note",
		room: "Room",
		placeholders: {
			name: "Your name",
			phone: "+998 …",
			email: "you@email.com",
			note: "Late flight, a bike, a quiet bunk…"
		},
		errors: {
			name: "Write a name we can greet.",
			phone: "Add a phone with at least 7 digits.",
			email: "That email looks incomplete.",
			dates: "Check-out has to be after check-in."
		},
		send: "Prepare the message",
		readyTitle: "Ready to send",
		readyLead: "Nothing was charged. Send this to the desk — they confirm the bed.",
		copyMsg: "Copy message",
		copiedMsg: "Message copied",
		another: "Edit request",
		yourNotes: "On this device",
		day: "Day",
		night: "Night",
		checkIn: "Check-in 1:00 PM",
		checkOut: "Check-out 12:00 PM",
		addressLabel: "Address",
		address: "Mustaqillik Avenue 63, Mirzo Ulugbek, Tashkent 100192, Uzbekistan",
		footerNote: "The Top Hostel · a leafy stay by Pushkin metro.",
		share: "Share",
		linkCopied: "Link copied",
		close: "Close",
		next: "Next photo",
		prev: "Previous photo",
		hoursIn: "1:00 PM",
		hoursOut: "12:00 PM",
		noCard: "No card on this page",
		estimate: "Estimate",
		hello: "Hello, The Top Hostel — I would like to stay.",
		tickets: "Requests saved on this phone",
		emptyDates: "Dates still open",
		sleeps: "Sleeps",
		askDesk: "Ask the desk",
		district: "Plus code 88G9+3G",
		resend: "Send again",
		honeypot: "Company"
	}
};
var roomCopy = {
	en: {
		bed: {
			name: "Bed in a shared room",
			blurb: "A twin or a curtained bunk in a room of 2–8. The rate on listings is per bed.",
			meta: "Shared bathroom"
		},
		queen: {
			name: "Queen and a double",
			blurb: "A private door, one queen and one double. Up to four if you travel close.",
			meta: "Bathroom confirmed in chat"
		},
		twin: {
			name: "Private twin",
			blurb: "Two single beds when a quieter room is free. We price it in the reply.",
			meta: "For two"
		}
	},
	ru: {
		bed: {
			name: "Кровать в общей комнате",
			blurb: "Односпальная или двухъярусная со шторкой, комната на 2–8 человек. Цена в объявлениях — за место.",
			meta: "Общий санузел"
		},
		queen: {
			name: "Queen и двуспальная",
			blurb: "Своя дверь: одна queen и одна двуспальная. До четырёх, если едете тесно.",
			meta: "Санузел подтвердим в чате"
		},
		twin: {
			name: "Отдельный twin",
			blurb: "Две односпальные, когда свободна более тихая комната. Цену напишем в ответе.",
			meta: "Для двоих"
		}
	},
	uz: {
		bed: {
			name: "Umumiy xonadagi yotoq",
			blurb: "2–8 kishilik xonada bir kishilik yoki pardali narvon-yotoq. Eʼlondagi narx bir joy uchun.",
			meta: "Umumiy hojatxona"
		},
		queen: {
			name: "Queen va ikki kishilik",
			blurb: "Oʻz eshigi: bitta queen va bitta ikki kishilik. Yaqin kelsangiz toʻrtgacha.",
			meta: "Hojatxonani chatda tasdiqlaymiz"
		},
		twin: {
			name: "Alohida twin",
			blurb: "Tinchroq xona boʻsh boʻlsa, ikkita bir kishilik yotoq. Narxni javobda yozamiz.",
			meta: "Ikki kishi"
		}
	}
};
var captions = {
	en: {
		facade: "The avenue in the afternoon",
		dusk: "Lanterns after blue hour",
		garden: "A small court and the bikes",
		dorm: "Bunks with curtains",
		private: "Queen and a double",
		twin: "Two singles",
		lounge: "The low room for sitting",
		bath: "A shared bath, kept plain",
		kitchen: "The long table",
		breakfast: "Light breakfast"
	},
	ru: {
		facade: "Проспект днём",
		dusk: "Фонари после синего часа",
		garden: "Маленький двор и велосипеды",
		dorm: "Кровати со шторками",
		private: "Queen и двуспальная",
		twin: "Две односпальные",
		lounge: "Низкая комната, чтобы посидеть",
		bath: "Общий душ, без лишнего",
		kitchen: "Длинный стол",
		breakfast: "Лёгкий завтрак"
	},
	uz: {
		facade: "Kunduzgi shoh koʻcha",
		dusk: "Moviy soatdan keyingi chiroqlar",
		garden: "Kichik hovli va velosipedlar",
		dorm: "Pardali yotoqlar",
		private: "Queen va ikki kishilik",
		twin: "Ikki bir kishilik",
		lounge: "Oʻtirish uchun past xona",
		bath: "Oddiy umumiy dush",
		kitchen: "Uzun stol",
		breakfast: "Yengil nonushta"
	}
};
var cats = [
	"all",
	"outside",
	"rooms",
	"food"
];
function Gallery({ copy, captions, openId, onOpen }) {
	const [cat, setCat] = (0, import_react.useState)("all");
	const visible = shots.filter((shot) => cat === "all" || shot.cat === cat);
	const openIndex = visible.findIndex((shot) => shot.id === openId);
	const active = openIndex >= 0 ? visible[openIndex] : null;
	(0, import_react.useEffect)(() => {
		if (openIndex < 0) return;
		const list = visible;
		const index = openIndex;
		const onKey = (event) => {
			if (event.key === "Escape") onOpen(null);
			if (event.key === "ArrowRight") onOpen(list[(index + 1) % list.length].id);
			if (event.key === "ArrowLeft") onOpen(list[(index - 1 + list.length) % list.length].id);
		};
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [
		openId,
		cat,
		openIndex,
		onOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap gap-2",
			children: cats.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "tap h-11 rounded-full px-4 text-sm " + (cat === key ? "bg-ink text-paper" : "border border-line bg-paper text-ink"),
				onClick: () => setCat(key),
				children: copy.filters[key]
			}, key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "masonry",
			children: visible.map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "mb-3 break-inside-avoid",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "tap block w-full overflow-hidden rounded-2xl text-left",
					onClick: () => onOpen(shot.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: shot.src,
						alt: captions[shot.id] ?? shot.id,
						className: "w-full object-cover",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "px-1 pt-2 text-sm text-muted",
						children: captions[shot.id]
					})]
				})
			}, shot.id))
		}),
		active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": captions[active.id],
			onClick: () => onOpen(null),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-paper text-ink",
					"aria-label": copy.close,
					onClick: () => onOpen(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink",
					"aria-label": copy.prev,
					onClick: (event) => {
						event.stopPropagation();
						onOpen(visible[(openIndex - 1 + visible.length) % visible.length].id);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "max-h-[82svh] max-w-5xl",
					onClick: (event) => event.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: active.src,
						alt: captions[active.id],
						className: "max-h-[74svh] w-auto max-w-full rounded-2xl object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "pt-3 text-center text-paper",
						children: captions[active.id]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink",
					"aria-label": copy.next,
					onClick: (event) => {
						event.stopPropagation();
						onOpen(visible[(openIndex + 1) % visible.length].id);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
				})
			]
		}) : null
	] });
}
function Orbit({ captions, hint, onOpen }) {
	const items = orbitShots.map((id) => {
		return {
			id,
			src: shots.find((s) => s.id === id).src,
			caption: captions[id] ?? id
		};
	});
	const n = items.length;
	const step = 360 / n;
	const stageRef = (0, import_react.useRef)(null);
	const drag = (0, import_react.useRef)(false);
	const moved = (0, import_react.useRef)(0);
	const lastX = (0, import_react.useRef)(0);
	const visible = (0, import_react.useRef)(true);
	const [yaw, setYaw] = (0, import_react.useState)(0);
	const [z, setZ] = (0, import_react.useState)(220);
	const [front, setFront] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const el = stageRef.current;
		if (!el) return;
		const measure = () => {
			const w = el.clientWidth;
			setZ(Math.max(150, Math.min(260, w * .32)));
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
	(0, import_react.useEffect)(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let frame = 0;
		let last = performance.now();
		const tickFrame = (now) => {
			const dt = Math.min(48, now - last);
			last = now;
			if (!reduce && !drag.current && visible.current) setYaw((y) => y + dt * .006);
			frame = requestAnimationFrame(tickFrame);
		};
		frame = requestAnimationFrame(tickFrame);
		return () => cancelAnimationFrame(frame);
	}, []);
	(0, import_react.useEffect)(() => {
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
	}, [
		yaw,
		n,
		step
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: stageRef,
		className: "orbit-stage relative mx-auto h-80 w-full max-w-3xl cursor-grab active:cursor-grabbing sm:h-96",
		onPointerDown: (event) => {
			drag.current = true;
			moved.current = 0;
			lastX.current = event.clientX;
			event.currentTarget.setPointerCapture(event.pointerId);
		},
		onPointerMove: (event) => {
			if (!drag.current) return;
			const dx = event.clientX - lastX.current;
			lastX.current = event.clientX;
			moved.current += Math.abs(dx);
			setYaw((y) => y + dx * .45);
		},
		onPointerUp: () => {
			drag.current = false;
		},
		onPointerCancel: () => {
			drag.current = false;
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "orbit-ring",
			style: { transform: `rotateY(${yaw}deg)` },
			children: items.map((item, i) => {
				const active = i === front;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "orbit-card tap overflow-hidden rounded-2xl border border-paper/25 shadow-lg",
					style: {
						transform: `rotateY(${i * step}deg) translateZ(${z}px)`,
						opacity: active ? 1 : .72
					},
					onClick: () => {
						if (moved.current < 8) onOpen(item.id);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.src,
						alt: item.caption,
						className: "h-full w-full object-cover",
						draggable: false,
						loading: "lazy"
					})
				}, item.id);
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-2 text-center text-sm text-brass-soft",
		"aria-live": "polite",
		children: [
			items[front]?.caption,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-2 text-paper/40",
				children: "·"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-paper/70",
				children: hint
			})
		]
	})] });
}
var amenityIcons = {
	wifi: Wifi,
	breakfast: Coffee,
	kitchen: Utensils,
	parking: Car,
	air: Wind,
	pets: PawPrint,
	quiet: Ban,
	metro: TrainFront
};
function buildMessage(copy, lang, stay) {
	const quote = quoteFor(rooms.find((item) => item.id === stay.roomId), stay);
	const name = roomCopy[lang][stay.roomId].name;
	const estimate = quote.total == null ? stay.roomId === "twin" ? copy.onRequest : copy.emptyDates : money(quote.total, lang);
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
		stay.note.trim() ? `${copy.note}: ${stay.note.trim()}` : ""
	].filter(Boolean).join("\n");
}
function errorsFor(copy, stay) {
	const next = {};
	if (stay.name.trim().length < 2) next.name = copy.errors.name;
	if (stay.phone.replace(/\D/g, "").length < 7) next.phone = copy.errors.phone;
	if (stay.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stay.email.trim())) next.email = copy.errors.email;
	const nights = quoteFor(rooms[0], stay).nights;
	if (!stay.checkIn || !stay.checkOut || nights <= 0) next.dates = copy.errors.dates;
	return next;
}
function HostelPage() {
	const [lang, setLang] = (0, import_react.useState)("ru");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [hour, setHour] = (0, import_react.useState)("day");
	const [mood, setMoodState] = (0, import_react.useState)("off");
	const [stay, setStay] = (0, import_react.useState)(emptyStay);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [ticket, setTicket] = (0, import_react.useState)(null);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [faqOpen, setFaqOpen] = (0, import_react.useState)(0);
	const copy = dict[lang];
	const caps = captions[lang];
	(0, import_react.useEffect)(() => {
		const savedLang = localStorage.getItem("th-lang");
		if (savedLang === "uz" || savedLang === "ru" || savedLang === "en") setLang(savedLang);
		const draft = localStorage.getItem("th-draft");
		if (draft) try {
			const parsed = JSON.parse(draft);
			setStay({
				...emptyStay(),
				...parsed,
				company: ""
			});
		} catch {}
		else {
			const start = /* @__PURE__ */ new Date();
			start.setDate(start.getDate() + 3);
			const end = new Date(start);
			end.setDate(start.getDate() + 1);
			const iso = (d) => {
				const month = String(d.getMonth() + 1).padStart(2, "0");
				const day = String(d.getDate()).padStart(2, "0");
				return `${d.getFullYear()}-${month}-${day}`;
			};
			setStay((prev) => ({
				...prev,
				checkIn: iso(start),
				checkOut: iso(end)
			}));
		}
		const savedTickets = localStorage.getItem("th-tickets");
		if (savedTickets) try {
			setTickets(JSON.parse(savedTickets));
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem("th-lang", lang);
		document.documentElement.lang = lang;
	}, [hydrated, lang]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem("th-draft", JSON.stringify({
			...stay,
			company: ""
		}));
	}, [hydrated, stay]);
	(0, import_react.useEffect)(() => () => void setMood("off"), []);
	const nights = quoteFor(rooms[0], stay).nights;
	const message = (0, import_react.useMemo)(() => ticket ? ticket.message : "", [ticket]);
	function patch(partial) {
		setStay((prev) => ({
			...prev,
			...partial
		}));
		setTicket(null);
	}
	async function play(next) {
		setMoodState(next);
		await setMood(next);
		if (next !== "off") tick();
	}
	async function onShare() {
		const url = window.location.href;
		try {
			if (navigator.share) {
				await navigator.share({
					title: copy.brand,
					text: copy.heroTitle,
					url
				});
				return;
			}
		} catch {
			return;
		}
		await navigator.clipboard.writeText(url);
		setCopied("link");
		tick();
	}
	async function onCopy(text, kind) {
		await navigator.clipboard.writeText(text);
		setCopied(kind);
		tick();
	}
	function onSubmit(event) {
		event.preventDefault();
		if (stay.company) return;
		const next = errorsFor(copy, stay);
		setErrors(next);
		if (Object.keys(next).length) return;
		const text = buildMessage(copy, lang, stay);
		const item = {
			id: String(Date.now()),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			message: text
		};
		const list = [item, ...tickets].slice(0, 5);
		setTicket(item);
		setTickets(list);
		localStorage.setItem("th-tickets", JSON.stringify(list));
		chime();
	}
	const wa = ticket ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(ticket.message)}` : `https://wa.me/${WHATSAPP}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#rooms",
				className: "sr-only",
				children: copy.nav.rooms
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#top",
						className: "flex items-center gap-2 text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl leading-none",
							children: "The Top"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex rounded-full border border-line p-1",
								children: [
									"uz",
									"ru",
									"en"
								].map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "tap h-11 min-w-11 rounded-full px-2 text-sm uppercase " + (lang === code ? "bg-ink text-paper" : "text-ink"),
									onClick: () => {
										setLang(code);
										tick();
									},
									children: code
								}, code))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "tap grid h-11 w-11 place-items-center rounded-full border border-line",
								"aria-label": mood === "off" ? copy.sound.garden : copy.sound.off,
								onClick: () => void play(mood === "off" ? "garden" : "off"),
								children: mood === "off" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trees, { size: 18 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#book",
								className: "tap hidden h-11 items-center rounded-full bg-leaf px-4 text-sm text-paper md:inline-flex",
								children: copy.book
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 text-sm",
					children: [
						["#house", copy.nav.house],
						["#rooms", copy.nav.rooms],
						["#gallery", copy.nav.gallery],
						["#area", copy.nav.area],
						["#book", copy.nav.ask]
					].map(([href, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href,
						className: "shrink-0 rounded-full px-3 py-2 text-muted hover:text-ink",
						children: label
					}, href))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid lg:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-h-[52svh] overflow-hidden bg-ink lg:col-span-7 lg:min-h-[88svh]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/photos/facade.jpg",
									alt: caps.facade,
									className: "drift absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " + (hour === "day" ? "opacity-100" : "opacity-0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/photos/dusk.jpg",
									alt: caps.dusk,
									className: "drift absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " + (hour === "night" ? "opacity-100" : "opacity-0"),
									loading: "lazy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-4 left-4 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HourButton, {
										active: hour === "day",
										onClick: () => setHour("day"),
										children: copy.day
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HourButton, {
										active: hour === "night",
										onClick: () => setHour("night"),
										children: copy.night
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "absolute right-4 bottom-4 max-w-xs text-right font-display text-2xl text-paper",
									children: copy.deal
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between gap-8 bg-paper px-5 py-8 lg:col-span-5 lg:px-10 lg:py-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm tracking-widest text-brass-deep uppercase",
									children: copy.kicker
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl",
									children: copy.heroTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-prose text-lg text-muted",
									children: copy.heroLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 flex flex-wrap items-end gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted",
											children: copy.from
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-4xl tabular-nums text-ink",
											children: money(220730, lang)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted line-through tabular-nums",
											children: money(289485, lang)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm text-muted",
									children: [
										copy.rating,
										" · ",
										copy.reviews
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "grid gap-3 rounded-3xl border border-line bg-paper-deep p-4",
								onSubmit: (event) => {
									event.preventDefault();
									document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "grid gap-1 text-sm",
											children: [copy.searchIn, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "field",
												type: "date",
												value: stay.checkIn,
												onChange: (event) => patch({ checkIn: event.target.value })
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "grid gap-1 text-sm",
											children: [copy.searchOut, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "field",
												type: "date",
												value: stay.checkOut,
												onChange: (event) => patch({ checkOut: event.target.value })
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: copy.guests
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
											value: stay.guests,
											less: copy.less,
											more: copy.more,
											onChange: (guests) => patch({ guests })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted tabular-nums",
										children: [
											nights > 0 ? nightsLabel(nights, lang) : copy.addDates,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mx-2",
												children: "·"
											}),
											guestsLabel(stay.guests, lang)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "tap h-12 rounded-full bg-leaf text-paper",
										children: copy.seeRooms
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "house",
						className: "scroll-mt-28 bg-ink px-5 py-16 text-paper md:px-10 md:py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-brass-soft",
									children: "01"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 max-w-xl font-display text-4xl",
									children: copy.orbitTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-xl text-paper/80",
									children: copy.orbitLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orbit, {
										captions: caps,
										hint: copy.orbitHint,
										onOpen: setOpenId
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-10 font-display text-2xl",
									children: copy.soundTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-3",
									children: [
										[
											"garden",
											Trees,
											copy.sound.garden,
											copy.soundLead.garden
										],
										[
											"lantern",
											Lamp,
											copy.sound.lantern,
											copy.soundLead.lantern
										],
										[
											"rain",
											CloudRain,
											copy.sound.rain,
											copy.soundLead.rain
										]
									].map(([id, Icon, label, lead]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "tap rounded-2xl border px-4 py-4 text-left " + (mood === id ? "border-brass bg-leaf text-paper" : "border-paper/20 text-paper"),
										onClick: () => void play(mood === id ? "off" : id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-3 block font-display text-xl",
												children: label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-sm text-paper/75",
												children: lead
											})
										]
									}, id))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "rooms",
						className: "scroll-mt-28 px-5 py-16 md:px-10 md:py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-brass-deep",
									children: "02"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-4xl",
									children: copy.roomsTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-2xl text-muted",
									children: copy.roomsLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-2xl text-sm text-muted",
									children: copy.priceNote
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 grid gap-5",
									children: rooms.map((room) => {
										const info = roomCopy[lang][room.id];
										const quote = quoteFor(room, stay);
										const active = stay.roomId === room.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: "grid overflow-hidden rounded-3xl border bg-paper-deep md:grid-cols-5 " + (active ? "border-leaf" : "border-line"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "md:col-span-2",
												onClick: () => setOpenId(room.id === "bed" ? "dorm" : room.id === "queen" ? "private" : "twin"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: room.image,
													alt: info.name,
													className: "h-56 w-full object-cover md:h-full",
													loading: "lazy"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col gap-3 p-5 md:col-span-3 md:p-7",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-start justify-between gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "font-display text-3xl",
															children: info.name
														}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded-full bg-leaf px-3 py-1 text-sm text-paper",
															children: copy.selected
														}) : null]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted",
														children: info.blurb
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm text-brass-deep",
														children: [
															copy.sleeps,
															" ",
															room.capacity,
															" · ",
															info.meta
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-display text-3xl tabular-nums",
														children: room.price == null ? copy.askDesk : money(room.price, lang)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm text-muted",
														children: [room.unit === "bed" ? copy.perBed : copy.perRoom, room.was ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "ml-2 line-through",
															children: [
																copy.was,
																" ",
																money(room.was, lang)
															]
														}) : null]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm",
														children: quote.total != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															copy.total,
															": ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums",
																children: money(quote.total, lang)
															}),
															quote.nights > 0 ? ` · ${nightsLabel(quote.nights, lang)}` : ""
														] }) : room.price == null ? copy.onRequest : copy.addDates
													}),
													quote.warning === "split" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-brass-deep",
														children: copy.splitNote
													}) : null,
													quote.warning === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-brass-deep",
														children: copy.overNote
													}) : null,
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-auto flex flex-wrap gap-2 pt-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															className: "tap h-11 rounded-full bg-ink px-4 text-sm text-paper",
															onClick: () => patch({ roomId: room.id }),
															children: copy.choose
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
															href: "#book",
															className: "tap inline-flex h-11 items-center rounded-full border border-line px-4 text-sm",
															children: copy.book
														})]
													})
												]
											})]
										}, room.id);
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "bg-paper-deep px-5 py-16 md:px-10 md:py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-10 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-brass-deep",
									children: "03"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-4xl",
									children: copy.aboutTitle
								}),
								copy.about.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-muted",
									children: paragraph
								}, paragraph.slice(0, 24))),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-sm text-ink",
									children: [
										copy.checkIn,
										" · ",
										copy.checkOut
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid grid-cols-2 gap-3 self-end",
								children: Object.keys(amenityIcons).map((key) => {
									const Icon = amenityIcons[key];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: copy.amenities[key]
										})]
									}, key);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-5 py-16 md:px-10 md:py-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-4xl",
									children: copy.themesTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-xl text-muted",
									children: copy.themesLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-8 grid gap-4 sm:grid-cols-2",
									children: themes.map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy.themes[theme.id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-muted",
											children: theme.count
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 rounded-full bg-paper-deep",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-leaf",
											style: { width: `${theme.count / 37 * 100}%` }
										})
									})] }, theme.id))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "gallery",
						className: "scroll-mt-28 px-5 py-4 pb-16 md:px-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-brass-deep",
									children: "04"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-4xl",
									children: copy.galleryTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-2xl text-muted",
									children: copy.galleryLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-2xl text-sm text-muted",
									children: copy.illustrative
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {
										copy,
										captions: caps,
										openId,
										onOpen: setOpenId
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "area",
						className: "scroll-mt-28 bg-ink px-5 py-16 text-paper md:px-10 md:py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-8 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-brass-soft",
									children: "05"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-4xl",
									children: copy.areaTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-paper/75",
									children: copy.areaLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-6 divide-y divide-paper/15",
									children: places.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-baseline justify-between gap-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy.places[place.id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-sm text-brass-soft tabular-nums",
											children: place.distance
										})]
									}, place.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-6 flex items-start gap-2 text-sm text-paper/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										size: 16,
										className: "mt-0.5 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [copy.address, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-brass-soft",
										children: copy.district
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: GOOGLE_LINK,
											className: "tap inline-flex h-11 items-center rounded-full bg-paper px-4 text-sm text-ink",
											target: "_blank",
											rel: "noreferrer",
											children: copy.google
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: MAP_LINK,
											className: "tap inline-flex h-11 items-center rounded-full border border-paper/25 px-4 text-sm",
											target: "_blank",
											rel: "noreferrer",
											children: copy.openMap
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "tap inline-flex h-11 items-center gap-2 rounded-full border border-paper/25 px-4 text-sm",
											onClick: () => void onCopy(copy.address, "addr"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 16 }), copied === "addr" ? copy.copied : copy.copyAddress]
										})
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-3xl border border-paper/20 bg-paper",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									title: copy.addressLabel,
									src: MAP_EMBED,
									className: "h-80 w-full md:h-full md:min-h-96",
									loading: "lazy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "bg-paper px-3 py-2 text-xs text-muted",
									children: "© OpenStreetMap"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-5 py-16 md:px-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-4xl",
								children: copy.faqTitle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 border-t border-line",
								children: copy.faq.map((item, index) => {
									const open = faqOpen === index;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b border-line",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex w-full items-center justify-between gap-4 py-4 text-left",
											"aria-expanded": open,
											onClick: () => setFaqOpen(open ? -1 : index),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-xl",
												children: item.q
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-brass-deep",
												children: open ? "–" : "+"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fold",
											"data-open": open ? "true" : "false",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "min-h-0 overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "pb-4 text-muted",
													children: item.a
												})
											})
										})]
									}, item.q);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "book",
						className: "scroll-mt-28 px-5 pb-28 md:px-10 md:pb-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-8 rounded-3xl border border-line bg-paper-deep p-5 md:grid-cols-2 md:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-brass-deep",
									children: "06"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-4xl",
									children: copy.formTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted",
									children: copy.formLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm text-ink",
									children: copy.noCard
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${PHONE_TEL}`,
									className: "mt-6 inline-flex items-center gap-2 font-display text-2xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 18 }), PHONE_PRETTY]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 text-sm text-muted",
									children: copy.address
								}),
								tickets.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm text-muted",
										children: copy.tickets
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 grid gap-2",
										children: tickets.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "tap w-full rounded-2xl border border-line bg-paper px-3 py-3 text-left text-sm",
											onClick: () => setTicket(item),
											children: item.message.split("\n").slice(0, 2).join(" · ")
										}) }, item.id))
									})]
								}) : null
							] }), ticket ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border-l-4 border-brass bg-paper p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-3xl",
										children: copy.readyTitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-muted",
										children: copy.readyLead
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "mt-4 whitespace-pre-wrap rounded-2xl bg-paper-deep p-4 text-sm",
										children: message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: wa,
												target: "_blank",
												rel: "noreferrer",
												className: "tap inline-flex h-12 items-center rounded-full bg-leaf px-5 text-paper",
												children: copy.whatsapp
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `tel:${PHONE_TEL}`,
												className: "tap inline-flex h-12 items-center rounded-full border border-line px-5",
												children: copy.call
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "tap inline-flex h-12 items-center gap-2 rounded-full border border-line px-5",
												onClick: () => void onCopy(message, "msg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 16 }), copied === "msg" ? copy.copiedMsg : copy.copyMsg]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mt-4 text-sm text-brass-deep",
										onClick: () => setTicket(null),
										children: copy.another
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "grid gap-3",
								onSubmit,
								noValidate: true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "absolute -left-full h-0 w-0 overflow-hidden",
										"aria-hidden": "true",
										children: [copy.honeypot, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											tabIndex: -1,
											autoComplete: "off",
											value: stay.company,
											onChange: (event) => patch({ company: event.target.value })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1 text-sm",
										children: [
											copy.name,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "field",
												name: "name",
												autoComplete: "name",
												value: stay.name,
												placeholder: copy.placeholders.name,
												onChange: (event) => patch({ name: event.target.value }),
												"aria-invalid": Boolean(errors.name)
											}),
											errors.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-brass-deep",
												children: errors.name
											}) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1 text-sm",
										children: [
											copy.phone,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "field",
												name: "tel",
												type: "tel",
												inputMode: "tel",
												autoComplete: "tel",
												value: stay.phone,
												placeholder: copy.placeholders.phone,
												onChange: (event) => patch({ phone: event.target.value }),
												"aria-invalid": Boolean(errors.phone)
											}),
											errors.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-brass-deep",
												children: errors.phone
											}) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1 text-sm",
										children: [
											copy.email,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "field",
												name: "email",
												type: "email",
												autoComplete: "email",
												value: stay.email,
												placeholder: copy.placeholders.email,
												onChange: (event) => patch({ email: event.target.value }),
												"aria-invalid": Boolean(errors.email)
											}),
											errors.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-brass-deep",
												children: errors.email
											}) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "grid gap-1 text-sm",
											children: [copy.searchIn, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "field",
												type: "date",
												value: stay.checkIn,
												onChange: (event) => patch({ checkIn: event.target.value })
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "grid gap-1 text-sm",
											children: [copy.searchOut, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "field",
												type: "date",
												value: stay.checkOut,
												onChange: (event) => patch({ checkOut: event.target.value })
											})]
										})]
									}),
									errors.dates ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-brass-deep",
										children: errors.dates
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: copy.guests
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
											value: stay.guests,
											less: copy.less,
											more: copy.more,
											onChange: (guests) => patch({ guests })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1 text-sm",
										children: [copy.room, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "field",
											value: stay.roomId,
											onChange: (event) => patch({ roomId: event.target.value }),
											children: rooms.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: room.id,
												children: roomCopy[lang][room.id].name
											}, room.id))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1 text-sm",
										children: [copy.note, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "field min-h-24",
											value: stay.note,
											placeholder: copy.placeholders.note,
											onChange: (event) => patch({ note: event.target.value })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "tap h-12 rounded-full bg-brass text-ink",
										children: copy.send
									})
								]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line px-5 py-8 md:px-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "The Top Hostel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: copy.footerNote
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "tap inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm",
							onClick: () => void onShare(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { size: 16 }), copied === "link" ? copy.linkCopied : copy.share]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${PHONE_TEL}`,
							className: "tap inline-flex h-11 items-center rounded-full bg-ink px-4 text-sm text-paper",
							children: copy.call
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-paper px-4 py-3 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: copy.from
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl tabular-nums",
					children: money(220730, lang)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#book",
					className: "tap inline-flex h-12 items-center rounded-full bg-leaf px-5 text-paper",
					children: copy.book
				})]
			})
		]
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "h-8 w-8 text-leaf",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "14.2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M11 21.5V13.5h10v8M13.2 13.5c.2-2.6 5.4-2.6 5.6 0",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 8.5v2.2",
				stroke: "currentColor",
				strokeWidth: "1.4"
			})
		]
	});
}
function HourButton({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "tap h-11 rounded-full px-4 text-sm " + (active ? "bg-paper text-ink" : "bg-ink/40 text-paper"),
		onClick,
		children
	});
}
function Stepper({ value, onChange, less, more }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "tap grid h-11 w-11 place-items-center rounded-full border border-line",
				"aria-label": less,
				onClick: () => onChange(Math.max(1, value - 1)),
				children: "–"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-8 text-center tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "tap grid h-11 w-11 place-items-center rounded-full border border-line",
				"aria-label": more,
				onClick: () => onChange(Math.min(12, value + 1)),
				children: "+"
			})
		]
	});
}
var SplitComponent = HostelPage;
//#endregion
export { SplitComponent as component };
