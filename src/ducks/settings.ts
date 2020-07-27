import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "App";

interface InitialState {
  isTestnet: boolean;
}

interface Setting {
  [key: string]: any;
}

const initialState: InitialState = {
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

export const isTestnetSelector = (state: RootState) => state.settings.isTestnet;

export const { reducer } = settingsSlice;
export const { update } = settingsSlice.actions;
