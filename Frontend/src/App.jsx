import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import { checkingUser, fetchCartItems } from "./API/api.js";
import Category from "./components/pages/Category.jsx";
import PurchaseSuccessPage from "./components/pages/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "./components/pages/PurchaseCancelPage.jsx";
import LoadingScreen from "./components/UI/LoadingScreen.jsx";

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.theme);
  const { user, loading } = useSelector(state => state.auth);
  const location = useLocation();
  const hasCheckedUser = useRef(false);

  useEffect(() => {
    if (user) {
      fetchCartItems(dispatch);
    }
  }, [dispatch, user]);

  // Checking user status when app first loads
  useEffect(() => {
    if (!hasCheckedUser.current) {
      hasCheckedUser.current = true;
      if (!user && location.pathname !== "/login" && location.pathname !== "/signup") {
        checkingUser(dispatch, false);
      }
    }
  }, [dispatch, user, location.pathname]);
  if(loading) {
    return (
     <LoadingScreen/>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`w-screen [background:radial-gradient(circle_at_center,_#1f1b2e_0%,_#15131e_60%,_#0e0c15_100%)] text-white transition-colors duration-300`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user?.role === "admin" ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/category/:category" element={user ? <Category /> : <Navigate to="/login" />} />
          <Route path="/success-purchase"  element={<PurchaseSuccessPage />}  />
          <Route path="/cancel-purchase" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />} />
        </Routes>
        <ToastContainer position="top-center" />
      </main>
    </>
  );
}

export default App;
