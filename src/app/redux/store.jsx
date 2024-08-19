"use client"
import { configureStore } from '@reduxjs/toolkit';
import savedDataReducer from './savedDataSlice';

const store = configureStore({
  reducer: {
    savedData: savedDataReducer,
  },
});

export default store;
