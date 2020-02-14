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
  uid: string;
  lastLogin: string;
  name: string;
  radar: string;
  id?: string;
  displayName?: string;
}

export enum LoginState {
  LOGIN_PENDING = 0,
  LOGGED_IN,
  LOGOUT_PENDING,
  LOGGED_OUT,
  UNKNOWN
}
