import { Blip, Meta, User } from './domain'

export interface BlipsState {
  blips: Blip[];
  isLoading: boolean;
  meta: Meta;
}

export interface UserState {
  user: User;
  userList: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
