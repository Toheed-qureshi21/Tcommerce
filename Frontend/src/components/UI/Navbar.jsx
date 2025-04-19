import { LogIn, Moon, ShoppingCart, Sun, User, UserPlus, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { toggleTheme } from '../../redux/slices/theme.slice';
import { useState } from 'react';
import { logout } from '../../API/api';

const Navbar = () => {
    const { theme } = useSelector(state => state.theme);
    const [isOn, setIsOn] = useState(false);
    const dispatch = useDispatch();
    const { user: isUser } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);
    const isAdmin = isUser?.role === "admin"



    const handleThemeChange = () => {
        setIsOn(!isOn);
        dispatch(toggleTheme());
    }
    const handleLogout = async () => {
        await logout(dispatch);
    }

    return (
        <header className={`w-screen px-4  py-6 shadow-xl ${theme ? "bg-gradient-to-r from-[#1a0b1f] via-[#2b1a38] to-[#0e0a18]  text-white" : "bg-white text-black"} 
        transition-colors duration-300 linear sticky top-0  z-100
        `}>

            <nav className={`mx-8 container flex justify-between items-center  `}>
                <h1 className='font-sans text-4xl font-jaini'>TCOMMERCE</h1>
                <ul className='flex gap-8 items-center text-md'>
                    <li>
                        <NavLink to="/">
                            Home
                        </NavLink>
                    </li>

                    <li >
                        <button className={`flex items-center transition-transform ease-linear  ${isOn ? "rotate-360" : ""}`} onClick={handleThemeChange}>{
                            theme ? <Sun size={20} className='text-amber-400' /> : <Moon size={20} />
                        } </button>
                    </li>
                    {
                        isUser ? (
                            <>
                                <li>
                                    <NavLink to="/cart" className="flex items-center gap-0.5 mt-0.5 relative group">
                                        <ShoppingCart className='inline-block mr-1' size={20} />
                                        <span className='hidden sm:inline'>Cart</span>

                                       { cartItems.length > 0 && (<span className='absolute bg-green-600 rounded-full -top-2 -left-2 text-white px-2 py-0.5 
									text-xs'>
                                            {cartItems.length}
                                        </span>)}
                                    </NavLink>
                                </li>
                                {
                                    isAdmin ? (
                                        <li>
                                            <NavLink to="/dashboard" className="flex items-center gap-0.5 bg-green-600 text-white hover:bg-green-700 transition-all linear px-2.5 py-1 rounded-md">
                                                <Lock size={20} /> Dashboard
                                            </NavLink>
                                        </li>

                                    ) : (
                                        <li >
                                            <NavLink to="/profile" className="flex items-center gap-0.5 bg-green-600 hover:bg-green-700 transition-all linear px-2.5 py-1 rounded-md">
                                                <User size={20} /> Profile
                                            </NavLink>
                                        </li>
                                    )
                                }

                                <li>
                                    <NavLink to="/">
                                        <button onClick={handleLogout} className='flex gap-2 items-center bg-sky-600 text-white hover:bg-sky-700 transition-all linear px-2.5 py-1 rounded-md '><LogIn size={20} />Logout</button>
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/signup" >
                                        <button className='flex gap-2 items-center bg-green-600 hover:bg-green-700 transition-all linear px-2.5 py-1 rounded-md text-white '><UserPlus size={20} />Signup</button>
                                    </NavLink>
                                </li>
                                <li >
                                    <NavLink to="/login">
                                        <button className='flex gap-2 items-center bg-sky-700 hover:bg-sky-800 transition-all linear px-2.5 py-1 rounded-md text-white'><LogIn size={20} />Login</button>
                                    </NavLink>
                                </li>
                            </>
                        )
                    }

                </ul>
            </nav>

        </header>
    )
}

export default Navbar
