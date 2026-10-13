"use client";

import { useCallback, useSyncExternalStore } from "react";
import { plans, type PlanId, type TemplateId } from "./templates";

// Shared state of one live demo: the creator's settings from the admin panel and the people
// in their fan list. The fan site and the admin panel both read it, so a fan who subscribes on
// the site shows up in the admin. It lives in localStorage (in memory when storage is blocked).

export type TierId = "fan" | "vip";
export type ProcessorId = "ccbill" | "segpay" | "verotel" | "epoch";
export type RegionId = "uk" | "us" | "eu" | "other";
export type FanStatus = "active" | "trial" | "lead" | "expired";
export type Source = "reddit" | "x" | "instagram" | "tiktok" | "direct";

export type Fan = {
  id: string;
  handle: string;
  email: string;
  status: FanStatus;
  tier?: TierId;
  plan?: PlanId;
  daysAgo: number;
  spent: number;
  source: Source;
  marketing: boolean;
};

export type Report = { id: string; reason: number; post: number; daysAgo: number; status: "open" | "removed" | "kept" };
export type Code = { code: string; pct: number; uses: number };

export type DemoState = {
  tiers: Record<TierId, number>;
  bundles: Record<PlanId, { on: boolean; pct: number }>;
  trial: { on: boolean; days: number; price: number };
  codes: Code[];
  processor: ProcessorId;
  descriptor: string;
  strictAge: Record<RegionId, boolean>;
  custodian: string;
  fans: Fan[];
  reports: Report[];
};

export const tierIds: TierId[] = ["fan", "vip"];
export const processorIds: ProcessorId[] = ["ccbill", "segpay", "verotel", "epoch"];
export const regionIds: RegionId[] = ["uk", "us", "eu", "other"];
export const sources: Source[] = ["reddit", "x", "instagram", "tiktok", "direct"];

const names = [
  "nightowl", "marco_v", "lukas88", "sunny.d", "kai_ro", "theo_w", "jules", "mattias", "rafa_92", "oskar.k",
  "devon", "leo_m", "ivan.p", "noah_b", "sam.r", "ari_v", "felix_o", "milo.t", "enzo", "hugo_l",
];

// The same made-up fan list every time, so reloading a demo looks the same.
function seedFans(): Fan[] {
  return names.map((handle, i) => {
    const status: FanStatus = i % 7 === 3 ? "expired" : i % 9 === 4 ? "trial" : i % 6 === 5 ? "lead" : "active";
    const plan = (["month", "three", "six", "twelve"] as const)[i % 4];
    return {
      id: `seed-${i}`,
      handle: `@${handle}`,
      email: `${handle.replace(/[._]/g, "")}@mail.example`,
      status,
      tier: status === "lead" ? undefined : i % 4 === 1 ? "vip" : "fan",
      plan: status === "lead" ? undefined : plan,
      daysAgo: 2 + ((i * 37) % 300),
      spent: status === "lead" ? 0 : Math.round((20 + ((i * 53) % 340)) * 100) / 100,
      source: sources[i % sources.length],
      marketing: i % 3 !== 2,
    };
  });
}

function initial(): DemoState {
  return {
    tiers: { fan: 9.99, vip: 24.99 },
    bundles: {
      month: { on: true, pct: 0 },
      three: { on: true, pct: 15 },
      six: { on: true, pct: 25 },
      twelve: { on: true, pct: 35 },
    },
    trial: { on: true, days: 7, price: 1 },
    codes: [
      { code: "WELCOME20", pct: 20, uses: 41 },
      { code: "SUMMER35", pct: 35, uses: 12 },
    ],
    processor: "ccbill",
    descriptor: "UNL*DIGITAL",
    strictAge: { uk: true, us: true, eu: false, other: false },
    custodian: "Custodian of Records, Studio Name Ltd., 1 Example Street, City, Country",
    fans: seedFans(),
    reports: [
      { id: "r1", reason: 0, post: 4, daysAgo: 1, status: "open" },
      { id: "r2", reason: 2, post: 7, daysAgo: 3, status: "open" },
      { id: "r3", reason: 1, post: 2, daysAgo: 9, status: "removed" },
    ],
  };
}

// Price of `months` of a tier after the bundle discount, and before any code.
export function bundlePrice(s: DemoState, tier: TierId, plan: PlanId) {
  const months = plans.find((p) => p.id === plan)!.months;
  return Math.round(s.tiers[tier] * months * (1 - s.bundles[plan].pct / 100) * 100) / 100;
}

export function monthlyRevenue(s: DemoState) {
  return s.fans
    .filter((f) => f.status === "active" && f.tier && f.plan)
    .reduce((sum, f) => sum + bundlePrice(s, f.tier!, f.plan!) / plans.find((p) => p.id === f.plan)!.months, 0);
}

const key = (id: TemplateId) => `demo-state:${id}`;
const cache = new Map<TemplateId, DemoState>();
const listeners = new Map<TemplateId, Set<() => void>>();

function read(id: TemplateId): DemoState {
  const hit = cache.get(id);
  if (hit) return hit;
  let state = initial();
  try {
    const saved = localStorage.getItem(key(id));
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch {
    // Blocked or broken storage: start from the seed.
  }
  cache.set(id, state);
  return state;
}

function write(id: TemplateId, state: DemoState) {
  cache.set(id, state);
  try {
    localStorage.setItem(key(id), JSON.stringify(state));
  } catch {
    // Storage blocked: changes last until the page closes.
  }
  listeners.get(id)?.forEach((notify) => notify());
}

const serverState = initial();

// The demo's state and a function to change it. Before hydration it is the seed state.
export function useDemoState(id: TemplateId) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const set = listeners.get(id) ?? new Set();
      set.add(notify);
      listeners.set(id, set);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key(id)) {
          cache.delete(id);
          notify();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        set.delete(notify);
        window.removeEventListener("storage", onStorage);
      };
    },
    [id],
  );
  const state = useSyncExternalStore(subscribe, () => read(id), () => serverState);
  const update = useCallback((change: (s: DemoState) => DemoState) => write(id, change(read(id))), [id]);
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(key(id));
    } catch {
      // Nothing saved to clear.
    }
    cache.delete(id);
    write(id, initial());
  }, [id]);
  return [state, update, reset] as const;
}

// A fan list as CSV, the way a creator would export it.
export function fansCsv(fans: Fan[], header: string[]) {
  const cell = (v: string | number | boolean | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = fans.map((f) => [f.handle, f.email, f.status, f.tier, f.plan, f.daysAgo, f.spent.toFixed(2), f.source, f.marketing].map(cell).join(","));
  return [header.map(cell).join(","), ...rows].join("\n");
}
