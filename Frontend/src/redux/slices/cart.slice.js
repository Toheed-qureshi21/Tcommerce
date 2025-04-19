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
        loading:false,
        error:false,
    },
    reducers: {
        setCartLoading(state){
            state.loading = true
        },
        setCartItems(state,action){
            state.cartItems = action.payload;
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
        calculateTotals(state){
            const subtotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            const total = subtotal;
            if (state.coupon) {
                const discount = subtotal * (coupon.discountPercentage / 100);
                total = subtotal - discount;
            }
            state.totalAmount = total;
            state.subTotalAmount = subtotal
           
        }
    }
})
export const {setCartLoading,setCartItems,setCartErrors,setRecommendedProducts,calculateTotals} = cartSlice.actions
export default cartSlice.reducer