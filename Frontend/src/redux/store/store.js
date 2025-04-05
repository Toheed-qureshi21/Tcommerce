import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/theme.slice.js";
import formReducer from "../slices/form.slice.js";
import authReducer from "../slices/auth.slice.js";
import productReducer from "../slices/product.slice.js"
export const store = configureStore({
    reducer:{
        theme:themeReducer,
        form:formReducer,
        auth:authReducer,
        products:productReducer,
    }
});