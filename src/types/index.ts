export interface Partner {
  id: "partner1" | "partner2";
  name: string;
}

export interface ConflictEntry {
  id: string;
  date: string;
  topic: string;
  partner1Perspective: string;
  partner2Perspective: string;
  commonGround: string;
  resolution: string;
  status: "unresolved" | "in-progress" | "resolved";
  emotionsBefore: EmotionLevel;
  emotionsAfter?: EmotionLevel;
}

export interface EmotionLevel {
  anger: number;
  sadness: number;
  frustration: number;
  hurt: number;
  anxiety: number;
}

export interface FeelingStatement {
  id: string;
  date: string;
  situation: string;
  feeling: string;
  need: string;
  request: string;
  fullStatement: string;
}

export interface AppreciationNote {
  id: string;
  date: string;
  from: string;
  to: string;
  message: string;
  category: AppreciationCategory;
}

export type AppreciationCategory =
  | "kindness"
  | "support"
  | "humor"
  | "effort"
  | "love"
  | "growth"
  | "patience"
  | "other";

export interface ResolutionStep {
  id: number;
  title: string;
  description: string;
  prompt: string;
  icon: string;
}

export interface CooldownExercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  type: "breathing" | "grounding" | "reflection";
}

export interface Guideline {
  id: number;
  title: string;
  description: string;
  doExample: string;
  dontExample: string;
}
