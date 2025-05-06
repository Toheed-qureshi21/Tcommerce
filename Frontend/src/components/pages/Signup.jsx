import React from 'react'
import AuthForm from '../UI/AuthForm'
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../API/api.js';

const Signup = () => {
  
  const dispatch = useDispatch();
  const loading = useSelector(state=>state.auth.loading);

  const handleSignup = async(formData) => {
    await signup(dispatch,formData);
    
  }
  return (
    <AuthForm
    showNameField={true} 
    submitText="Signup" 
    redirectText="Already have an account ? " 
    redirectLink="/login" 
    redirectLinkText="Login here" 
    onSubmit={handleSignup}
    authText="Hey there! Please enter your details to signup."
    loading={loading}
    isGuest={false}
  />
  )
}

export default Signup
