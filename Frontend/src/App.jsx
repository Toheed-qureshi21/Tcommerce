import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/UI/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Cart from "./components/pages/Cart";
import Profile from "./components/pages/Profile";
import Dashboard from "./components/pages/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { checkingUser } from "./API/api.js";
import Category from "./components/pages/Category.jsx";



function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.theme);
  const {user,loading } = useSelector(state => state.auth);
  const location = useLocation();

  const hasCheckedUser = useRef(false);
  
  useEffect(() => {
    
      if (
        !user &&
        !hasCheckedUser.current &&
         location.pathname !== "/login" &&
         location.pathname !== "/signup" 
        ) {
          hasCheckedUser.current =true;
        checkingUser(dispatch,false);
      }
    
   
  }, [dispatch,user,location.pathname]);

  

  return (
        <>
      <Navbar />
      {
        loading  ? (
          
          <div className="w-full h-screen flex justify-center items-center bg-zinc-950">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white "></div>
            </div>
          
        ) :
        ( <main className={` w-screen ${theme ? "[background:radial-gradient(circle_at_center,_#1f1b2e_0%,_#15131e_60%,_#0e0c15_100%)] text-white" : "bg-white text-black"} transition-colors duration-300`}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user?.role === "admin" ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/category/:category" element={!user ? <Navigate to="/login" /> : <Category/>} />
        </Routes>
        <ToastContainer />
      </main>
    )
  }
  
  </>
  );
}

export default App;
