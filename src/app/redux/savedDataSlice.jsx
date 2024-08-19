"use client"
import { createSlice } from '@reduxjs/toolkit';

const savedDataSlice = createSlice({
  name: 'savedData',
  initialState: [],
  reducers: {
    setSavedData: (state, action) => {
      return action.payload;
    },
    addSavedData: (state, action) => {
      return [...state, action.payload];
    },
  },
});

export const { setSavedData, addSavedData } = savedDataSlice.actions;
export default savedDataSlice.reducer;
