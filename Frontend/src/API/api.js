import axios from "axios";
import { authChecking, authFailure, authStart, authSuccess, authCheckingFailure, authCheckingSuccess, resetAuth } from "../redux/slices/auth.slice.js";
import { toast } from "react-toastify";
import { addProduct, deleteProductFromState, setError, setLoading, setLoadingDelete, setLoadingFeature, setProducts, updateSingleProduct } from "../redux/slices/product.slice.js";
import { calculateTotals, setCartErrors, setCartItems, setCartLoading, setRecommendedProducts } from "../redux/slices/cart.slice.js";
import toastConfig from "../config/toastConfig.js";



const URL = "http://localhost:3000/api"

const api = axios.create({
    baseURL: URL,
    withCredentials: true
});

export const signup = async (dispatch, { name, email, password, confirmPassword, role }) => {


    dispatch(authStart());
    try {
        if (!name || !email || !password || !confirmPassword) {
            return toast.error("All fields are required");
        }

        if (password !== confirmPassword) {
            return toastConfig("Passwords do not match");
        }

        const response = await api.post("/auth/signup", { name, email, password, role });
        console.log(response);
        dispatch(authSuccess(response?.data?.userWithoutPassword));
        toastConfig(response?.data?.message);

    } catch (error) {
        console.log(error);

        dispatch(authFailure(error?.response?.data?.message));

        return toastConfig(error?.response?.data?.message);
    }
}

export const login = async (dispatch, { email, password }) => {
    dispatch(authStart());
    try {
        if (!email || !password) {
            return toastConfig("All fields are required");
        }


        const { data } = await api.post("/auth/login", { email, password });
        dispatch(authSuccess(data?.userWithoutPassword))
        return toastConfig(data?.message);
    } catch (error) {
        dispatch(authFailure(error?.response?.data?.message));
        return toastConfig(error?.response?.data?.message);
    }
}

export const checkingUser = async (dispatch, showToast = false) => {
    dispatch(authStart());
    try {
        const response = await api.get("/auth/profile");
        dispatch(authSuccess(response?.data?.userWithoutPassword));
        showToast && toastConfig(response?.data?.message);
    } catch (error) {
        dispatch(authFailure(error?.response?.data?.message));
        showToast && toastConfig(error?.response?.data?.message);
    }
}

export const logout = async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await api.get("/auth/logout");
        dispatch(resetAuth(null));
        return toastConfig(response?.data?.message);

    } catch (error) {
        dispatch(authFailure(error?.response?.data?.message));
        if (showToast) {
            toastConfig(error?.response?.data?.message);
        }
    }
}

// This function will create new product 
export const createProduct = async (dispatch, newProduct) => {
    dispatch(setLoading(true));
    try {
        const response = await api.post("/products/create-product", newProduct);
        dispatch(addProduct(response?.data?.product));
        toastConfig(response?.data?.message || "Product created successfully!");
    } catch (error) {
        dispatch(setError(error));
        return toastConfig(error?.response?.data?.message);
    }
}

// This function will fetch all products of admin
export const fetchAllProductsOfAdmin = async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get("/products");
        const products = response?.data?.products
        dispatch(setProducts(products));
    } catch (error) {
        dispatch(setError(error));
        return toastConfig(error?.response?.data?.message || "Failed to fetch products. Please try again.");
    }
}

// Function to featured any product by admin
export const toggleFeaturedProduct = async (dispatch, productId) => {
    dispatch(setLoadingFeature(true));
    try {
        const response = await api.patch(`/products/update/${productId}`);
        const updatedProduct = response?.data?.updatedProduct
        dispatch(updateSingleProduct(updatedProduct));
        return toastConfig(response?.data?.message || "Product featured successfully!");
    } catch (error) {
        dispatch(setError(error));
        return toastConfig(error?.response?.data?.message || "Failed to feature product. Please try again.");
    }
}

// Function to delete any product by admin
export const deleteProduct = async (dispatch, productId) => {
    dispatch(setLoadingDelete(true));
    try {
        const response = await api.delete(`/products/delete/${productId}`);
        dispatch(deleteProductFromState(productId));
        return toastConfig(response?.data?.message || "Product deleted successfully!");
    } catch (error) {
        dispatch(setError(error));
        return toastConfig(error?.response?.data?.message || "Failed to Delete product. Please try again.");
    }
}

// Function to fetch category wise products
export const fetchCategoryWiseProducts = async (dispatch, category) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get(`/products/category/${category}`);
        const products = response?.data?.products;
        dispatch(setProducts(products));
    } catch (error) {
        dispatch(setError(error.response.data.message));
        return toastConfig(error?.response?.data?.message || "Failed to fetch products. Please try again.");
    }
}

// Function to fetch cart items of user
export const fetchCartItems = async (dispatch) => {
    dispatch(setCartLoading(true));
    try {
        const response = await api.get("/cart/");
        const cartItems = response?.data?.cartItems;
        dispatch(calculateTotals(cartItems))
        console.log(cartItems);
        dispatch(setCartItems(cartItems));
    } catch (error) {
        dispatch(setCartErrors(error.response.data.message));
        return toastConfig(error?.response?.data?.message || "Failed to fetch cart items. Please try again.");
    }
}



// Function to add product to cart
export const addToCart = async (dispatch, productId) => {
    dispatch(setCartLoading(true))

    try {
        const response = await api.post(`/cart`, { productId });
        dispatch(setCartItems(response?.data?.cartItems));
        dispatch(calculateTotals(response?.data?.cartItems));
        toastConfig(response?.data?.message || "Product added to cart successfully!");
    } catch (error) {
        dispatch(setCartErrors(error.response.data.message));
        toastConfig(error?.response?.data?.message || "Failed to add product to cart. Please try again.");
    }
}

// Function for removing products from cart
export const removeItemFromCart = async (dispatch, productId) => {
    dispatch(setCartLoading(true));
    try {
        const response = await api.delete(`/cart/delete/${productId}`);
        dispatch(setCartItems(response?.data?.cartItems));
        dispatch(calculateTotals(response?.data?.cartItems));
        console.log('Updated cart items:', response?.data?.cartItems);
        toastConfig(response?.data?.message || "Product removed from cart successfully!");

    } catch (error) {
        dispatch(setCartErrors(error.response.data.message));
        toastConfig(error?.response?.data?.message || "Failed to remove product from cart. Please try again.");
    }
}

// Function for updating quantity of product in cart
export const updateQuantity = async (dispatch, productId, quantity) => {
    dispatch(setCartLoading(true));

    try {
        const response = await api.put(`/cart/update/${productId}`, { quantity });
        dispatch(setCartItems(response?.data?.cartItems));
        dispatch(calculateTotals(response?.data?.cartItems));
        toastConfig(response?.data?.message || "Product quantity updated successfully!");
    } catch (error) {
        dispatch(setCartErrors(error?.response?.data?.message));
        toastConfig(error?.response?.data?.message || "Failed to update product quantity. Please try again.");
    }
}

// Function to fetch recommended prouducts
export const fetchRecommendedProducts = async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get("/products/recommendations");
        const recommendedProducts = response?.data?.products;
        console.log("Recommended products:",recommendedProducts);
        
        dispatch(setRecommendedProducts(recommendedProducts));
    } catch (error) {
        dispatch(setError(error.response.data.message));
        return toastConfig(error?.response?.data?.message || "Failed to fetch recommended products. Please try again.");
    }
}