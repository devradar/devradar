export interface Blip {
  title: string;
  category: number;
  changes: BlipChange[];
  link: string;
  id: string;
  description?: string;
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

export enum RadarTabState {
  RadarChart = 0,
  History
}
