import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name:'products',
    initialState:{
        products:[],
        loading:false,
        error:null
    },
    reducers:{
        setLoading(state){
            state.loading = true,
            state.error = null
        },
        setProducts(state,action){
            state.loading = false,
            state.products = action.payload
        },
        setError(state,action){
            state.loading = false,
            state.error = action.payload
        }
    }
})
export const {setLoading,setProducts,setError} = productSlice.actions
export default productSlice.reducer;