import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/theme.slice.js";
import formReducer from "../slices/form.slice.js";
import authReducer from "../slices/auth.slice.js";
import productReducer from "../slices/product.slice.js"
import cartReducer from "../slices/cart.slice.js"

export const store = configureStore({
    reducer:{
        theme:themeReducer,
        form:formReducer,
        auth:authReducer,
        products:productReducer,
        cart:cartReducer
    }
});