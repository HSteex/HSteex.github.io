import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const matchRef = ref(db, "match");

// ─── Periodi ────────────────────────────────────────────────────────────────
export const PERIODS = [
  { id: "PRE",  label: "Pre",        short: "PRE",  timed: false },
  { id: "1T",   label: "1° Tempo",   short: "1°T",  timed: true },
  { id: "INT",  label: "Intervallo", short: "INT",  timed: false },
  { id: "2T",   label: "2° Tempo",   short: "2°T",  timed: true },
  { id: "1S",   label: "1° Supp.",   short: "1°S",  timed: true },
  { id: "2S",   label: "2° Supp.",   short: "2°S",  timed: true },
  { id: "FINE", label: "Fine",       short: "FINE", timed: false },
];
export const periodInfo = id => PERIODS.find(p => p.id === id) || PERIODS[0];

export const DEFAULT_MATCH = {
  home: { name: "Casa", color: "#d32f2f", color2: "#ffffff", logo: "", score: 0 },
  away: { name: "Ospiti", color: "#1976d2", color2: "#ffffff", logo: "", score: 0 },
  settings: { periodMinutes: 40, extraMinutes: 15 },
  period: "PRE",
  clock: { running: false, startedAt: 0, elapsedMs: 0 },
};

// Unisce i dati del DB con i default (campi mancanti → default)
export function normalize(m) {
  m = m || {};
  return {
    home: { ...DEFAULT_MATCH.home, ...(m.home || {}) },
    away: { ...DEFAULT_MATCH.away, ...(m.away || {}) },
    settings: { ...DEFAULT_MATCH.settings, ...(m.settings || {}) },
    period: m.period || DEFAULT_MATCH.period,
    clock: { ...DEFAULT_MATCH.clock, ...(m.clock || {}) },
  };
}

// ─── Orologio server ────────────────────────────────────────────────────────
let serverOffset = 0;
onValue(ref(db, ".info/serverTimeOffset"), s => { serverOffset = s.val() || 0; });
export const serverNow = () => Date.now() + serverOffset;

// Millisecondi trascorsi nel periodo corrente
export function elapsedMs(clock) {
  const e = (clock.elapsedMs || 0) + (clock.running ? serverNow() - (clock.startedAt || 0) : 0);
  return Math.max(0, e);
}

// Inizio (in minuti) e durata del periodo corrente
function periodBounds(period, s) {
  const P = Number(s.periodMinutes) || 0, E = Number(s.extraMinutes) || 0;
  switch (period) {
    case "1T": return [0, P];
    case "2T": return [P, P];
    case "1S": return [2 * P, E];
    case "2S": return [2 * P + E, E];
    default:   return [0, 0];
  }
}

const mmss = ms => {
  const t = Math.floor(ms / 1000);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

// Restituisce { main: "23:41", extra: "+1:12" | "" }
export function clockDisplay(match) {
  const { period, settings, clock } = match;
  if (!periodInfo(period).timed) return { main: period === "PRE" ? "00:00" : "", extra: "" };
  const [startMin, lenMin] = periodBounds(period, settings);
  const e = elapsedMs(clock), len = lenMin * 60000;
  if (len > 0 && e > len) return { main: mmss(startMin * 60000 + len), extra: "+" + mmss(e - len).replace(/^0/, "") };
  return { main: mmss(startMin * 60000 + e), extra: "" };
}

export const logoUrl = file => file ? `loghi/${encodeURIComponent(file)}` : "";
