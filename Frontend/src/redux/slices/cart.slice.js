import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        recommendedProducts:[],
        coupon:null,
        totalAmount:0,
        subTotalAmount:0,
        isCouponApplied:false,
        isPurchaseProcessing:false,
        loading:false,
        error:false,
        paymentButtonLoading:false
    },
    reducers: {
        setCartLoading(state){
            state.loading = true
        },
        setPaymetButtonLoading(state,action){
            state.paymentButtonLoading = action.payload 
        },
        setCartItems(state, action) {
            state.cartItems = action.payload.map(item => ({
              ...item,
              productId: item.productId || item._id,  // 👈 Ensure consistent field
            }));
            state.loading = false;
          },
          
        setRecommendedProducts(state,action){
            state.recommendedProducts = action.payload;
            state.loading = false;
        },
        setCartErrors(state,action){    
            state.error = action.payload;
            state.loading = false;
        },
        setIsPurchaseProcessing(state,action){
            state.isPurchaseProcessing = action.payload;
        },
        calculateTotals(state){
            const subtotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            const total = subtotal;
            if (state.coupon) {
                const discount = subtotal * (coupon.discountPercentage / 100);
                total = subtotal - discount;
            }
            state.totalAmount = total;
            state.subTotalAmount = subtotal
           
        },
        clearCart(state){
            state.cartItems = [];
            state.coupon = null;
            state.totalAmount = 0;
            state.subTotalAmount =0;
        }
    }
})
export const {setCartLoading,setCartItems,setCartErrors,setRecommendedProducts,calculateTotals,setPaymetButtonLoading,clearCart,setIsPurchaseProcessing} = cartSlice.actions
export default cartSlice.reducer