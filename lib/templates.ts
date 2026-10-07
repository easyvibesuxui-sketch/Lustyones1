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
  // Demo images, e.g. "/demo/velvet/01.jpg". Empty until the AI images are added.
  images: { avatar?: string; cover?: string; feed: string[] };
};

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
    images: { feed: [] },
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
    images: { feed: [] },
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
    images: { feed: [] },
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
    images: { feed: [] },
  },
];
