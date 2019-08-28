export interface Blip {
  title: string;
  category: number;
  level: number;
  link?: string;
  description?: string;
  changes?: BlipChange[];
}

export interface BlipChange {
  date: string;
  newLevel: number;
  text?: string;
}

export interface Item {
  title: string;
  filename: string;
  payload: RadarContent;
}

export interface RadarContent {
  meta: {
    title: string;
    categories: string[];
    levels: string[];
  };
  blips: Blip[];
}