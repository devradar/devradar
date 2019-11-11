import { Blip, Meta, User } from './domain'

export interface BlipsState {
  id: string;
  blips: Blip[];
  isLoading: boolean;
  meta: Meta;
  radarRedirect?: string;
  isPublic: boolean;
}

export interface UserState {
  user: User;
  userList: any;
}

export interface SettingsState {
  selectedBlipsTitle: string[];
}

export interface CommState {
  snackbar: {
    text: string;
    active: boolean;
  };
}

export interface RootState {
  version: string;
}
