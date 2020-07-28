import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthType } from "constants/types.d";
import { RootState } from "config/store";

interface InitialState {
  authType?: AuthType;
  isTestnet: boolean;
}

interface Setting {
  [key: string]: any;
}

const initialState: InitialState = {
  authType: undefined,
  isTestnet: process.env.NODE_ENV === "development",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Setting>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const settingsSelector = (state: RootState) => state.settings;

export const { reducer } = settingsSlice;
export const { update } = settingsSlice.actions;
