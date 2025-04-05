import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formData:{
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        role:"user"
    }
};

const formSlice = createSlice({
    name:'form',
    initialState,
    reducers:{
        updateFormData:(state,action)=>{
            state.formData = {...state.formData,...action.payload};
        },
        resetFormData:(state,action)=>{
            state.formData = {
                ...(action.payload?.clearName ? {name:""}:{}),
                email:"",
                password:"",
                ...(action.payload?.clearName ? {confirmPassword:""}:{}),
                ...(action.payload?.clearName ? {role:""}:{}),
        }   
        }
    }
});
export const {updateFormData,resetFormData} = formSlice.actions
export default formSlice.reducer;