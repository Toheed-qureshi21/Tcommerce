import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    loadingFeature: false,  // For feature loading state
    loadingDelete: false,   // For delete loading state
    error: null
  },
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setLoadingFeature(state) {
      state.loadingFeature = true;
      state.error = null;
    },
    setLoadingDelete(state) {
      state.loadingDelete = true;
      state.error = null;
    },
    setProducts(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    setError(state, action) {
      state.loading = false;
      state.loadingFeature = false;
      state.loadingDelete = false;  // Stop loading states when there's an error
      state.error = action.payload;
    },
    updateSingleProduct(state, action) {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(product => product._id === updatedProduct._id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      state.loadingFeature = false; // Reset feature loading after update
    },
    deleteProductFromState(state, action) {
      const productId = action.payload;
      state.products = state.products.filter(product => product._id !== productId);
      state.loadingDelete = false; // Reset delete loading after successful deletion
    }
  }
});

export const {
  setLoading,
  setProducts,
  setError,
  deleteProductFromState,
  updateSingleProduct,
  setLoadingDelete,
  setLoadingFeature
} = productSlice.actions;

export default productSlice.reducer;
