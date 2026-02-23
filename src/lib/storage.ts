import { ConflictEntry, FeelingStatement, AppreciationNote } from "@/types";

const STORAGE_KEYS = {
  CONFLICTS: "couplecare_conflicts",
  FEELINGS: "couplecare_feelings",
  APPRECIATIONS: "couplecare_appreciations",
  PARTNER_NAMES: "couplecare_partners",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getConflicts(): ConflictEntry[] {
  return getItem<ConflictEntry[]>(STORAGE_KEYS.CONFLICTS, []);
}

export function saveConflict(entry: ConflictEntry): void {
  const conflicts = getConflicts();
  const idx = conflicts.findIndex((c) => c.id === entry.id);
  if (idx >= 0) {
    conflicts[idx] = entry;
  } else {
    conflicts.unshift(entry);
  }
  setItem(STORAGE_KEYS.CONFLICTS, conflicts);
}

export function deleteConflict(id: string): void {
  const conflicts = getConflicts().filter((c) => c.id !== id);
  setItem(STORAGE_KEYS.CONFLICTS, conflicts);
}

export function getFeelings(): FeelingStatement[] {
  return getItem<FeelingStatement[]>(STORAGE_KEYS.FEELINGS, []);
}

export function saveFeeling(entry: FeelingStatement): void {
  const feelings = getFeelings();
  feelings.unshift(entry);
  setItem(STORAGE_KEYS.FEELINGS, feelings);
}

export function getAppreciations(): AppreciationNote[] {
  return getItem<AppreciationNote[]>(STORAGE_KEYS.APPRECIATIONS, []);
}

export function saveAppreciation(note: AppreciationNote): void {
  const appreciations = getAppreciations();
  appreciations.unshift(note);
  setItem(STORAGE_KEYS.APPRECIATIONS, appreciations);
}

export function getPartnerNames(): { partner1: string; partner2: string } {
  return getItem(STORAGE_KEYS.PARTNER_NAMES, {
    partner1: "Partner 1",
    partner2: "Partner 2",
  });
}

export function savePartnerNames(names: {
  partner1: string;
  partner2: string;
}): void {
  setItem(STORAGE_KEYS.PARTNER_NAMES, names);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
