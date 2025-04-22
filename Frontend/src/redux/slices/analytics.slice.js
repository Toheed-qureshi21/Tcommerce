import { createSlice } from "@reduxjs/toolkit";

const analyticsSlice = createSlice({
        name:'analyticsData',
        initialState:{
            products:0,
            totalSales:0,
            totalRevenue:0,
            analyticsLoading:false,
            dailySalesData:[]
        },

        reducers:{
            setAnalyticsLoading(state,action){
                state.analyticsLoading = action.payload;
            },
            setAnalyticsData(state, action) {
                const { products, totalSales, totalRevenue } = action.payload;
                state.products = products;
                state.totalSales = totalSales;
                state.totalRevenue = totalRevenue;
                // state.analyticsLoading = false;
            },
            setDailySalesData(state,action){
                state.dailySalesData =action.payload;
                // state.analyticsLoading = false;
            }
        }

});
export const {setAnalyticsLoading,setAnalyticsData,setDailySalesData} = analyticsSlice.actions
export default analyticsSlice.reducer;