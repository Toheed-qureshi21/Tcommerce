import axios from "axios";
import { authChecking, authFailure, authStart, authSuccess, authCheckingFailure, authCheckingSuccess, resetAuth } from "../redux/slices/auth.slice.js";
import { toast } from "react-toastify";
import { deleteProductFromState, setError, setLoading, setLoadingDelete, setLoadingFeature, setProducts, updateSingleProduct } from "../redux/slices/product.slice.js";



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
            return toast.error("Passwords do not match");
        }

        const response = await api.post("/auth/signup", { name, email, password, role });
        console.log(response);
        dispatch(authSuccess(response?.data?.userWithoutPassword));
        toast.success(response?.data?.message);

    } catch (error) {
        console.log(error);

        dispatch(authFailure(error?.response?.data?.message));

        return toast.error(error?.response?.data?.message);
    }
}

export const login = async (dispatch, { email, password }) => {
    dispatch(authStart());
    try {
        if (!email || !password) {
            return toast.error("All fields are required");
        }


        const { data } = await api.post("/auth/login", { email, password });
        dispatch(authSuccess(data?.userWithoutPassword))
        return toast.success(data?.message);
    } catch (error) {
        dispatch(authFailure(error?.response?.data?.message));
        return toast.error(error?.response?.data?.message);
    }
}

export const checkingUser = async (dispatch, showToast = false) => {
    dispatch(authStart());
    try {
        const response = await api.get("/auth/profile");
        dispatch(authSuccess(response?.data?.userWithoutPassword));
        showToast && toast.success(response?.data?.message);
    } catch (error) {
        dispatch(authFailure(error?.response?.data?.message));
        showToast && toast.error(error?.response?.data?.message);
    }
}

export const logout = async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await api.get("/auth/logout");
        dispatch(resetAuth(null));
        return toast.success(response?.data?.message);

    } catch (error) {
        dispatch(authFailure(error?.response?.data?.message));
        if (showToast) {
            toast.error(error?.response?.data?.message);
        }
    }
}

// This function will create new product 
export const createProduct = async (dispatch,newProduct) => {
    dispatch(setLoading(true));
    try {
        const response = await api.post("/products/create-product",newProduct);
        dispatch(setProducts(response?.data?.product || []));
        dispatch(setLoading(false));
        
        toast.success(response?.data?.message || "Product created successfully!");
    } catch (error) {
        dispatch(setLoading(false));
        dispatch(setError(error));
        return toast.error(error?.response?.data?.message);
    }
}

// This function will fetch all products of admin
export const fetchAllProductsOfAdmin = async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get("/products");
        const products = response?.data?.products
        
        dispatch(setProducts(products));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        dispatch(setError(error));
        return toast.error(error?.response?.data?.message||"Failed to fetch products. Please try again.");
    }
}

// Function to featured any product by admin
export const toggleFeaturedProduct = async (dispatch,productId) => {
    dispatch(setLoadingFeature(true));
    try {
        const response = await api.patch(`/products/update/${productId}`);
        const updatedProduct = response?.data?.updatedProduct
        console.log("updated products",updatedProduct);
        
        dispatch(updateSingleProduct(updatedProduct));
        return toast.success(response?.data?.message || "Product featured successfully!");
    } catch (error) {
        dispatch(setError(error));
        return toast.error(error?.response?.data?.message || "Failed to feature product. Please try again.");
    } finally{
        dispatch(setLoadingFeature(false));
    }
}

// Function to delete any product by admin
export const deleteProduct = async (dispatch,productId) => {
    dispatch(setLoadingDelete(true));
    try {
            const response = await api.delete(`/products/delete/${productId}`);
            dispatch(deleteProductFromState(productId));
            dispatch(setLoadingDelete(false));
            return toast.success(response?.data?.message || "Product deleted successfully!");
    } catch (error) {
        dispatch(setLoadingDelete(false))
        dispatch(setError(error));
        return toast.error(error?.response?.data?.message || "Failed to Delete product. Please try again.");
    }
}