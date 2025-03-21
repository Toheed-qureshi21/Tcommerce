import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/theme.slice.js";

export const store = configureStore({
    reducer:{
        theme:themeReducer
    }
});