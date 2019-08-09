import { Blip, Item } from './domain'

export interface ItemsState {
  team?: Item;
  devs: Item[];
}

export interface RootState {
  version: string;
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