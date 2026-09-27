import type { Bi } from "./i18n";

export type Pro = {
  id: number; name: Bi; role: string; agency: Bi; city: Bi; bio: Bi; phone: string;
  rating: number; reviews: number; deals: number; hue: number; initials: string;
  specialties: string[]; verified: boolean;
};

export type Property = {
  id: number; slug: string; title: Bi; city: Bi; district: Bi; deal: "sale" | "rent"; kind: string;
  price: number; deposit: number; rent: number; area: number; beds: number; baths: number;
  parking: number; floor: number; yearBuilt: number; cover: string; rating: number; views: number;
  likes: number; featured: boolean; pricePerMeter: number; pro?: Pro;
  description?: Bi; gallery?: string[]; features?: string[]; lat?: number; lng?: number;
};

export type Step = { id: number; order: number; title: Bi; hint: Bi; done: boolean };
export type Phase = { key: string; order: number; title: Bi; summary: Bi; icon: string; accent: string; duration: Bi; steps: Step[] };
export type Journey = { phases: Phase[]; completed: number; total: number; percent: number };
export type Tip = { id: number; slug: string; phase: string; category: Bi; title: Bi; body: Bi; readMin: number; cover: string; pro?: Pro | null };
export type Facets = { cities: { en: string; fa: string; count: number }[]; kinds: string[]; features: string[]; priceMin: number; priceMax: number; total: number };
export type Stats = { properties: number; pros: number; cities: number; avgPricePerMeter: number; deals: number; satisfaction: number };
