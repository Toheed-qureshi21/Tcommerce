import React from 'react'
import AuthForm from '../UI/AuthForm'
import { login } from '../../API/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state=>state.auth.loading);
  const navigate = useNavigate();
  const handleLogin = async(formData) => {
      await login(dispatch,formData);
      sessionStorage.setItem("fromLogin", "true");
      return navigate("/")
  }

  return (
    <AuthForm 
    showNameField={false} 
    submitText="Login" 
    redirectText="Don't have an account?" 
    redirectLink="/signup" 
    redirectLinkText="Sign up here" 
    onSubmit={handleLogin}
    authText="Welcome back! Please enter your details to login."
    loading={loading}
    isGuest={true}
  />
  )
}

export default Login

