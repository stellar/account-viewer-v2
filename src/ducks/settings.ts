import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthType } from "types/types.d";
import { RootState } from "config/store";

interface SettingsInitialState {
  authType: AuthType | undefined;
  isTestnet: boolean;
}

interface Setting {
  [key: string]: any;
}

const initialState: SettingsInitialState = {
  authType: undefined,
  isTestnet: process.env.NODE_ENV === "development",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettingsAction: (state, action: PayloadAction<Setting>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const settingsSelector = (state: RootState) => state.settings;

export const { reducer } = settingsSlice;
export const { updateSettingsAction } = settingsSlice.actions;
