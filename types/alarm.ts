export type ResolutionStage =
  | "idle"
  | "redTerritory"
  | "pause"
  | "listen"
  | "solutions";

export interface Technique {
  id: string;
  label: string;
  description: string;
}

export interface SolutionSuggestion {
  id: string;
  title: string;
  details: string;
  actions: string[];
}
