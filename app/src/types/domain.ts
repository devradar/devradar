export interface Blip {
  title: string;
  category: number;
  description: string;
  changes: BlipChange[];
  link: string;
  id: string;
  level?: number;
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
