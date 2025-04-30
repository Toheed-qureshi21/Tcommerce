import axios from "axios";
import {loadStripe} from "@stripe/stripe-js"
import { authChecking, authFailure, authStart, authSuccess, authCheckingFailure, authCheckingSuccess, resetAuth } from "../redux/slices/auth.slice.js";
import { toast } from "react-toastify";
import { addProduct, deleteProductFromState, setError, setLoading, setLoadingDelete, setLoadingFeature, setProducts, updateSingleProduct } from "../redux/slices/product.slice.js";
import { calculateTotals, clearCart, setCartErrors, setCartItems, setCartLoading, setCoupon, setIsCouponApplied, setIsPurchaseProcessing, setPaymetButtonLoading, setRecommendedProducts } from "../redux/slices/cart.slice.js";
import toastConfig from "../config/toastConfig.js";
import { setAnalyticsData, setAnalyticsLoading, setDailySalesData } from "../redux/slices/analytics.slice.js";



const URL = "/api"


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
        dispatch(authSuccess(response?.data?.userWithoutPassword));
        toastConfig(response?.data?.message);

    } catch (error) {

        dispatch(authFailure(error?.response?.data?.message));

        return toastConfig(error?.response?.data?.message,"error");
    }
}

export const login = async (dispatch, { email, password }) => {
    dispatch(authStart());
    try {
        if (!email || !password) {
            return toastConfig("All fields are required");
        }


        const response  = await api.post("/auth/login", { email, password });
        dispatch(authSuccess(response?.data?.userWithoutPassword))
        toastConfig(response?.data?.message,"success");
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        dispatch(authFailure(error?.response?.data?.message));
        toastConfig(error?.response?.data?.message,"error");
        return false;
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
        showToast && toastConfig(error?.response?.data?.message,"error");
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
            toastConfig(error?.response?.data?.message,"error");
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
        return toastConfig(error?.response?.data?.message,"error");
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
        return toastConfig(error?.response?.data?.message || "Failed to fetch products. Please try again.","error");
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
        return toastConfig(error?.response?.data?.message || "Failed to feature product. Please try again.","error");
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
        return toastConfig(error?.response?.data?.message || "Failed to Delete product. Please try again.","error");
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
        return toastConfig(error?.response?.data?.message || "Failed to fetch products. Please try again.","error");
    }
}

// Function to fetch cart items of user
export const fetchCartItems = async (dispatch) => {
    dispatch(setCartLoading(true));
    try {
        const response = await api.get("/cart/");
        const cartItems = response?.data?.cartItems;
        dispatch(calculateTotals(cartItems))
        dispatch(setCartItems(cartItems));
    } catch (error) {
        dispatch(setCartErrors(error.response.data.message));
        return toastConfig(error?.response?.data?.message || "Failed to fetch cart items. Please try again.","error");
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
        toastConfig(error?.response?.data?.message || "Failed to add product to cart. Please try again.","error");
    }
}

// Function for removing products from cart
export const removeItemFromCart = async (dispatch, productId) => {
    dispatch(setCartLoading(true));
    try {
        const response = await api.delete(`/cart/delete/${productId}`);
        dispatch(setCartItems(response?.data?.cartItems));
        dispatch(calculateTotals(response?.data?.cartItems));
        toastConfig(response?.data?.message || "Product removed from cart successfully!");

    } catch (error) {
        dispatch(setCartErrors(error.response.data.message));
        toastConfig(error?.response?.data?.message || "Failed to remove product from cart. Please try again.","error");
    }
}

// Function for updating quantity of product in cart
export const updateQuantity = async (dispatch,id,quantity) => {
    dispatch(setCartLoading(true));
    try {
        const response = await api.patch(`/cart/update/${id}`, {quantity });
        dispatch(setCartItems(response?.data?.cartItems));
        dispatch(calculateTotals(response?.data?.cartItems));
        toastConfig(response?.data?.message || "Product quantity updated successfully!");
    } catch (error) {
        dispatch(setCartErrors(error?.response?.data?.message));
        toastConfig(error?.response?.data?.message || "Failed to update product quantity. Please try again.","error");
    }
}

// Function to fetch recommended prouducts
export const fetchRecommendedProducts = async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get("/products/recommendations");
        const recommendedProducts = response?.data?.products;
        dispatch(setRecommendedProducts(recommendedProducts));
    } catch (error) {
        dispatch(setError(error.response.data.message));
        return toastConfig(error?.response?.data?.message || "Failed to fetch recommended products. Please try again.","error");
    }
}

// fUNCTION FOR CREATING PAYMENT
export const createPayment = async (dispatch,cartItems,coupon) => {
    dispatch(setPaymetButtonLoading(true));
    try {
        const stripe = await loadStripe("pk_test_51QzcKlKHxSEe6HXrt4nAu38pcn2C0YAJ5RjOlqOthiNy5p8bYWZ5vraE0gcscgLCOokeKCEQIWEPHO1UKE3THQNY00WnIiXmMK");
        const response = await api.post("/payments/create-checkout-session", { products:cartItems, couponCode:coupon ? coupon.code : null });
        const session  = response?.data;
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        })
        if (result.error) {
            toastConfig(result.error);
        }

    } catch (error) {
        return toastConfig(error?.response?.data?.message,"error");
    } finally {
        dispatch(setPaymetButtonLoading(false))
    }
}

// Function for chekout-success for payment
    export const handleCheckoutSuccess = async(dispatch,sessionId)=>{
                dispatch(setIsPurchaseProcessing(true))
            try {
            const res = await api.post("/payments/verify-checkout-session",{sessionId});
            if (res.data.success) {
                dispatch(clearCart());
                fetchCartItems(dispatch)
            }
                return toastConfig(res.data.message);
            } catch (error) {
                toastConfig(error.res.data.message||"Failed to verify payment. Please try again.","error");
            } finally {
                dispatch(setIsPurchaseProcessing(false));
            }
    }

// Function to get coupons 
export const getMyCoupon = async (dispatch) => {
    try {
        const response = await api.get("/coupons");
        dispatch(setCoupon(response.data));
    } catch (error) {
        return toastConfig(error?.response?.data?.message,"error");
    }
    
}

// Function to apply coupon 
export const applyCoupon = async (dispatch,code) => {
    try {
        const response = await api.post("/coupons/validate",{code});
        dispatch(setCoupon(response.data.code));
        dispatch(setIsCouponApplied(true));
        dispatch(calculateTotals());
        return toastConfig("Coupon applied successfully!");
    } catch (error) {
        return toastConfig(error?.response?.data?.message,"error");
    }
}

// Function to fetch analytics data
export const getAnalyticsData = async (dispatch) => {
    dispatch(setAnalyticsLoading(true));
    try {
        const response = await api.get("/analytics");
        dispatch(setAnalyticsData(response.data.analyticsData));
        dispatch(setDailySalesData(response.data.salesDataOfWeek));
        dispatch(setAnalyticsLoading(false))
    } catch (error) {
        dispatch(setAnalyticsLoading(false));
        return toastConfig(error?.response?.data?.message||"Failed to fetch analytics data. Please try again.","error");
    }
}

export const updateProfile = async (dispatch,{userDetails}) => {
        dispatch(authStart());
        try {
            const response = await api.patch("/auth/change-profile",{userDetails});
            dispatch(authSuccess(response?.data?.userWithoutPassword));
            toastConfig(response?.data?.message);
        } catch (error) {
            toastConfig(error?.response?.data?.message,"error");
        }
}
export const postEmailToForgotPassword = async(email)=>{
    try {
        const response = await api.post("/auth/reset-password",{email});
        toastConfig(response?.data?.message);
    } catch (error) {
        toastConfig(error?.response?.data?.message,"error");
    }
};
export const getToken= async(token)=>{
    try {
        const response = await api.get(`/auth/reset-password/${token}`); 
        toastConfig(response?.data?.message);
        return response?.data?.success;
    } catch (error) {
        toastConfig(error?.response?.data?.message,"error");
        return { success: false };
    }
}

export const postNewPassword = async (newPassword,confirmPassword,token) => {
        
        try {
            const response = await api.post(`/auth/reset-password/${token}`,{newPassword,confirmPassword});
            toastConfig(response?.data?.message);
            return response?.data;
        } catch (error) {
            toastConfig(error?.response?.data?.message,"error");
        }
}

// Email verification functions
export const getEmailVerificationEmail = async()=>{
    try {
        const response = await api.get(`/auth/send-verification-link`);
        console.log(response.data);
        return toastConfig(response?.data?.message);
    } catch (error) {
        toastConfig(error?.response?.data?.message,"error");
    }
}

export const sendOTP = async(token) => {
    try {
        const response = await api.post(`/auth/verify-email-link`,{token});
        return toastConfig(response?.data?.message);
    } catch (error) {
        toastConfig(error?.response?.data?.message,"error");
    }
}
