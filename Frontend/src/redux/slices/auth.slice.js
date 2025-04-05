import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    loading:false,
    checkingAuth:false,
    error:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        authStart:(state)=>{
            state.loading = true;
        },
        authChecking:(state)=>{
            state.checkingAuth = true
        },
        authCheckingSuccess:(state,action)=>{
            state.checkingAuth = false
            state.user = action.payload
            state.error = null
        },
        authCheckingFailure:(state,action)=>{
            state.checkingAuth = false,
            state.user = null
            state.error = action.payload

        },
        authSuccess:(state,action)=>{
            state.user = action.payload,
         
            state.loading = false,
            state.error = null
        },
        authFailure:(state,action)=>{
            state.user = null,
            state.loading = false,
         
            state.error = action.payload
        },
        resetAuth: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        
    }
});

export const {authStart,authSuccess,authFailure,authChecking,authCheckingFailure,authCheckingSuccess,resetAuth} = authSlice.actions;
export default authSlice.reducer