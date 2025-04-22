import { createSlice } from "@reduxjs/toolkit";
const calculateTotalsFn = (state) => {
    const subtotal = state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  
    let total = subtotal;
  
    if (state.coupon) {
      const discount = subtotal * (state.coupon.discount / 100);
      total = subtotal - discount;
    }
  
    state.totalAmount = total;
    state.subTotalAmount = subtotal;
  };
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
          setIsCouponApplied(state,action){
            state.isCouponApplied = action.payload  
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
           calculateTotalsFn(state)
        },
        clearCart(state){
            state.cartItems = [];
            state.coupon = null;
            state.totalAmount = 0;
            state.subTotalAmount =0;
        },
        setCoupon(state,action){   
            state.coupon = action.payload
        },
        clearCoupon(state){
            state.coupon = null;
            state.isCouponApplied = false;
            calculateTotalsFn(state);
        }
    }
})
export const {setCartLoading,setCartItems,setCartErrors,setRecommendedProducts,calculateTotals,setPaymetButtonLoading,clearCart,setIsPurchaseProcessing,setCoupon,setIsCouponApplied,clearCoupon} = cartSlice.actions
export default cartSlice.reducer