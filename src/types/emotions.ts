export const EMOTION_KEYS = [
  "awe",
  "fear",
  "anger",
  "disgust",
  "sadness",
  "amusement",
  "excitement",
  "contentment",
] as const;

export const EMOTION_LABELS: Record<EmotionKey, string> = {
  awe: "Awe",
  fear: "Fear",
  anger: "Anger",
  disgust: "Disgust",
  sadness: "Sadness",
  amusement: "Amusement",
  excitement: "Excitement",
  contentment: "Contentment",
};

export type EmotionKey = (typeof EMOTION_KEYS)[number];

export interface EmotionsChartData {
  movieTitle: string;
  area: EmotionAreaPoint[];
  radar: EmotionRadarPoint[];
}

export type EmotionAreaPoint = Record<EmotionKey, number> & {
  frame: number;
  timestamp: number;
};

export interface EmotionRadarPoint {
  emotion: string;
  magnitude: number;
  fullMark?: number;
}
