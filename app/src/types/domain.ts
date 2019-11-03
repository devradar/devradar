export interface Blip {
  title: string;
  category: number;
  level: number;
  link?: string;
  description?: string;
  changes?: BlipChange[];
  id?: string;
  index?: number;
}

export interface BlipChange {
  date: string;
  newLevel: number;
  text?: string;
  id?: string;
}

export interface Meta {
  title: string;
  categories: string[];
  levels: string[];
}

export interface User {
  id: string;
  uid?: string;
  lastLogin: string;
  name: string;
  displayName: string;
}

export interface Radar {
  meta: Meta;
  blips: Blip[];
}