export type TemplateId = "velvet" | "bloom" | "neon" | "editorial";
export type Mood = "dark" | "light";

export type TemplateTheme = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  // Placeholder "photo" colours, used until real demo images are added.
  tones: [string, string, string];
  font: "display" | "body" | "bold";
};

export type Template = {
  id: TemplateId;
  name: string;
  mood: Mood;
  creator: { name: string; handle: string; posts: number; photos: number; videos: number };
  price: string;
  theme: TemplateTheme;
  // Demo images under public/, e.g. "/demo/neon/01.webp". Empty until images are added.
  // `scene` is a portrait crop for small thumbnails; `backdrop` a blurred landscape version of the same photo.
  // `stage` is the photo for the home page keyhole: the sharp portrait, a blurred wide copy of it,
  // its width / height, the point (0-1 across, 0-1 down) that should sit in the keyhole's round opening,
  // and optionally its height as a share of the screen's (default 1.4). Stage file names carry a short
  // content hash, so a replaced photo gets a new URL and browsers don't show a cached old one.
  images: {
    avatar?: string;
    cover?: string;
    scene?: string;
    backdrop?: string;
    stage?: Stage;
    feed: string[];
  };
};

export type Stage = { src: string; backdrop: string; ratio: number; focus: [x: number, y: number]; zoom?: number };

export type PlanId = "month" | "three" | "six" | "twelve";

// The subscription offer every demo creator page shows: the base tier's price for each bundle length.
// Live demos work prices out from the creator's settings instead (lib/demo-store.ts).
export const plans: { id: PlanId; months: number; price: number; save: number }[] = [
  { id: "month", months: 1, price: 9.99, save: 0 },
  { id: "three", months: 3, price: 25.47, save: 15 },
  { id: "six", months: 6, price: 44.95, save: 25 },
  { id: "twelve", months: 12, price: 77.92, save: 35 },
];

// Templates whose feed uses two wide columns instead of three.
export const twoColumnFeed = new Set<TemplateId>(["bloom", "editorial"]);

export const templates: Template[] = [
  {
    id: "velvet",
    name: "Velvet",
    mood: "dark",
    creator: { name: "Mira Vale", handle: "miravale", posts: 248, photos: 1240, videos: 86 },
    price: "$490",
    theme: {
      bg: "#1A0B14",
      surface: "#2B1220",
      text: "#F5E6D3",
      muted: "#B89A8C",
      accent: "#C9A25E",
      accentText: "#1A0B14",
      tones: ["#6B2B3A", "#A2574B", "#D9A27E"],
      font: "display",
    },
    images: {
      avatar: "/demo/velvet/avatar.webp",
      cover: "/demo/velvet/cover.webp",
      scene: "/demo/velvet/scene.webp",
      backdrop: "/demo/velvet/bg.webp",
      stage: { src: "/demo/velvet/stage.489d6743.webp", backdrop: "/demo/velvet/stage-bg.d5b36cfe.webp", ratio: 0.562, focus: [0.5, 0.2] },
      feed: ["/demo/velvet/01.webp", "/demo/velvet/02.webp", "/demo/velvet/03.webp", "/demo/velvet/04.webp", "/demo/velvet/05.webp", "/demo/velvet/06.webp", "/demo/velvet/07.webp", "/demo/velvet/08.webp", "/demo/velvet/09.webp"],
    },
  },
  {
    id: "bloom",
    name: "Bloom",
    mood: "light",
    creator: { name: "Sunny Lark", handle: "sunnylark", posts: 182, photos: 910, videos: 54 },
    price: "$490",
    theme: {
      bg: "#FFF6F3",
      surface: "#FFFFFF",
      text: "#3B2A33",
      muted: "#76606C",
      accent: "#C2477A",
      accentText: "#FFFFFF",
      tones: ["#F4C7C3", "#F9E1B8", "#C9DFC9"],
      font: "body",
    },
    images: {
      avatar: "/demo/bloom/avatar.webp",
      cover: "/demo/bloom/cover.webp",
      scene: "/demo/bloom/scene.webp",
      backdrop: "/demo/bloom/bg.webp",
      stage: { src: "/demo/bloom/stage.f2c3e077.webp", backdrop: "/demo/bloom/stage-bg.549f837c.webp", ratio: 0.97, focus: [0.48, 0.5], zoom: 1 },
      feed: ["/demo/bloom/01.webp", "/demo/bloom/02.webp", "/demo/bloom/03.webp", "/demo/bloom/04.webp", "/demo/bloom/05.webp", "/demo/bloom/06.webp", "/demo/bloom/07.webp", "/demo/bloom/08.webp", "/demo/bloom/09.webp"],
    },
  },
  {
    id: "neon",
    name: "Neon",
    mood: "dark",
    creator: { name: "Kira Volt", handle: "kiravolt", posts: 315, photos: 1480, videos: 132 },
    price: "$490",
    theme: {
      bg: "#0E0B1F",
      surface: "#1B1638",
      text: "#EDEBFF",
      muted: "#9A93C9",
      accent: "#3DF2E0",
      accentText: "#0E0B1F",
      tones: ["#FF3DA5", "#6A3DFF", "#3DF2E0"],
      font: "bold",
    },
    images: {
      avatar: "/demo/neon/avatar.webp",
      cover: "/demo/neon/cover.webp",
      scene: "/demo/neon/scene.webp",
      backdrop: "/demo/neon/bg.webp",
      stage: { src: "/demo/neon/stage.0e4e0de5.webp", backdrop: "/demo/neon/stage-bg.c0907af5.webp", ratio: 0.926, focus: [0.45, 0.4] },
      feed: ["/demo/neon/01.webp", "/demo/neon/02.webp", "/demo/neon/03.webp", "/demo/neon/04.webp", "/demo/neon/05.webp", "/demo/neon/06.webp", "/demo/neon/07.webp", "/demo/neon/08.webp", "/demo/neon/09.webp"],
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    mood: "light",
    creator: { name: "Lena Noir", handle: "lenanoir", posts: 96, photos: 640, videos: 22 },
    price: "$490",
    theme: {
      bg: "#F2F0EC",
      surface: "#FFFFFF",
      text: "#141414",
      muted: "#6B6660",
      accent: "#141414",
      accentText: "#F2F0EC",
      tones: ["#BFB6AA", "#8C8278", "#D8D1C7"],
      font: "display",
    },
    images: {
      avatar: "/demo/editorial/avatar.webp",
      cover: "/demo/editorial/cover.webp",
      scene: "/demo/editorial/scene.webp",
      backdrop: "/demo/editorial/bg.webp",
      stage: { src: "/demo/editorial/stage.61f5da84.webp", backdrop: "/demo/editorial/stage-bg.8852bbdb.webp", ratio: 0.562, focus: [0.5, 0.32] },
      feed: ["/demo/editorial/01.webp", "/demo/editorial/02.webp", "/demo/editorial/03.webp", "/demo/editorial/04.webp", "/demo/editorial/05.webp", "/demo/editorial/06.webp", "/demo/editorial/07.webp", "/demo/editorial/08.webp", "/demo/editorial/09.webp"],
    },
  },
];
