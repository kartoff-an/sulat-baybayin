export interface StrokeData {
  id: number;
  path: string;
  description: string;
  direction: string;
  startPoint?: { x: number; y: number };
  endPoint?: { x: number; y: number };
}

export interface BaybayinCharacter {
  id: string;
  baybayin: string;
  latin: string;
  pronunciation: string;
  category: "vowels" | "consonants" | "special";
  description: string;
  examples: string[];
  strokes: StrokeData[];
}

export type CharacterCategory = "all" | "vowels" | "consonants" | "special";
