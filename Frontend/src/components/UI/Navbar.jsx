import {
    LogIn,
    ShoppingCart,
    User,
    UserPlus,
    Lock,
    Menu,
    X,
  } from 'lucide-react';
  import { useDispatch, useSelector } from 'react-redux';
  import { NavLink } from 'react-router-dom';
  import { toggleTheme } from '../../redux/slices/theme.slice';
  import { useEffect, useState } from 'react';
import { resetAuth } from '../../redux/slices/auth.slice';
  
  const Navbar = () => {
    const [isOn, setIsOn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { user: isUser } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);
    const isAdmin = isUser?.role === "admin";
  
    const handleThemeChange = () => {
      setIsOn(!isOn);
      dispatch(toggleTheme());
    };
    useEffect(() => {
      if (!isUser) {
      }
      
    },[])
    const handleLogout = async () => {
     dispatch(resetAuth(null));
    window.open(import.meta.env.PROD ? "https://tcommerce.onrender.com/api/auth/logout" : "http://localhost:3000/api/auth/logout", "_self");
      setIsMenuOpen(false);
    };
  
    const toggleMenu = () => {
      setIsMenuOpen(prev => !prev);
    };
  
    return (
      <header className="w-full overflow-hidden max-lg:px-8 py-6 shadow-xl bg-gradient-to-r from-[#1a0b1f] via-[#2b1a38] to-[#0e0a18] text-white  sticky top-0 z-[1000]">
        <nav className="px- lg:px-12 flex justify-between items-center w-screen">
          {/* Logo */}
          <h1 className="font-sans text-4xl font-jaini z-50 ">TCOMMERCE</h1>
  
          {/* Hamburger Icon */}
          <button onClick={toggleMenu} className="lg:hidden z-50 mr-12 ">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
  
          {/* Desktop Nav */}
          <ul className="hidden lg:flex gap-8 items-center text-md">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {isUser ? (
              <>
                <li>
                  <NavLink to="/cart" className="flex items-center gap-0.5 mt-0.5 relative group">
                    <ShoppingCart className='inline-block mr-1' size={20} />
                    <span className='hidden sm:inline'>Cart</span>
                    {cartItems.length > 0 && (
                      <span className='absolute bg-green-600 rounded-full -top-2 -left-2 text-white px-2 py-0.5 text-xs'>
                        {cartItems.length}
                      </span>
                    )}
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink to="/dashboard" className="flex items-center gap-0.5 bg-green-600 text-white hover:bg-green-700 transition-all linear px-2.5 py-1 rounded-md">
                      <Lock size={20} /> Dashboard
                    </NavLink>
                  </li>
                ) }
                  <li>
                    <NavLink to="/profile" className="flex items-center gap-0.5 bg-indigo-500 hover:bg-indigo-700 transition-all linear px-2.5 py-1 rounded-md">
                      <User size={20} /> Profile
                    </NavLink>
                  </li>
              
                <li>
                  <NavLink target='_blank' to="http://localhost:3000/api/auth/logout">
                  <button onClick={handleLogout}  className="flex gap-2 items-center bg-sky-600 text-white hover:bg-sky-700 transition-all linear px-2.5 py-1 rounded-md">
                    <LogIn size={20} /> Logout
                  </button>
                    </NavLink>   
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/signup">
                    <button className="flex gap-2 items-center bg-green-600 hover:bg-green-700 transition-all linear px-2.5 py-1 rounded-md text-white">
                      <UserPlus size={20} /> Signup
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login">
                    <button className="flex gap-2 items-center bg-sky-700 hover:bg-sky-800 transition-all linear px-2.5 py-1 rounded-md text-white">
                      <LogIn size={20} /> Login
                    </button>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
  
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[998]"
            onClick={toggleMenu}
          />
        )}
  
        <div className={`fixed top-0 left-0 h-full w-full bg-gradient-to-r from-[#1a0b1f] via-[#2b1a38] to-[#0e0a18] text-white shadow-lg transform transition-transform duration-300 ease-in-out z-[999] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
  
          <button onClick={toggleMenu} className="absolute top-4 right-4 text-white z-[1001]">
            <X size={28} />
          </button>
  
          <ul className="flex flex-col  mt-24 gap-6 px-6 text-lg">
            <li>
              <NavLink to="/" onClick={toggleMenu}>Home</NavLink>
            </li>
            {isUser ? (
              <>
                <li>
                  <NavLink to="/cart" onClick={toggleMenu} className="flex items-center gap-2 relative">
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                    {cartItems.length > 0 && (
                      <span className="absolute bg-green-600 rounded-full -top-2 -left-2 text-white px-2 py-0.5 text-xs">
                        {cartItems.length}
                      </span>
                    )}
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink to="/dashboard" onClick={toggleMenu} className="w-fit justify-center flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-all linear px-3 py-2 rounded-md text-center">
                      <Lock size={20} /> Dashboard
                    </NavLink>
                  </li>
                )}
                  <li>
                    <NavLink to="/profile" onClick={toggleMenu} className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-700 w-fit transition-all linear px-8 rounded-md py-2">
                      <User size={20} /> Profile
                    </NavLink>
                  </li>
                <li>
                  <button onClick={handleLogout} className="flex gap-2 items-center bg-sky-600 hover:bg-sky-700 transition-all linear px-8 py-2 rounded-md text-white">
                    <LogIn size={20} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/signup" onClick={toggleMenu}>
                    <button className="flex gap-2 items-center bg-green-600 hover:bg-green-700 transition-all linear px-3 py-2 rounded-md text-white">
                      <UserPlus size={20} /> Signup
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" onClick={toggleMenu}>
                    <button className="flex gap-2 items-center bg-sky-700 hover:bg-sky-800 transition-all linear px-3 py-2 rounded-md text-white">
                      <LogIn size={20} /> Login
                    </button>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>
    );
  };
  
  export default Navbar;
  