import { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resetFormData, updateFormData } from "../../redux/slices/form.slice.js";

const AuthForm = ({
    showNameField,
    submitText,
    redirectText,
    onSubmit,
    redirectLink,
    redirectLinkText,
    authText,
    loading,
    isGuest,
}) => {

    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useSelector(state => state.theme);
    const { formData } = useSelector(state => state.form);
    const dispatch = useDispatch();
    const navigate = useNavigate()


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateFormData({ [name]: value }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
        dispatch(resetFormData());
    }

    const handleGuestLogin = () => {
        dispatch(updateFormData({ email: "guest@example.com", password: "000000" }));
    }

    const handleLoginWithGoogle = () => {
        window.open(import.meta.env.PROD === "production" ? "https://tcommerce.onrender.com/api/auth/google" : "http://localhost:3000/api/auth/google", "_self");
    }
    const handleLoginWithGithub = () => {
      window.open(import.meta.env.PROD === "production" ? "https://tcommerce.onrender.com/api/auth/google" : "http://localhost:3000/api/auth/github", "_self");
    }
    

    return (
        <section className={`min-h-screen flex flex-col justify-center gap-8 font-medium items-center bg-zinc-950  max-sm:px-4`}>
            <section className="flex flex-col items-center justify-center max-xl:order-1">
                <p className="text-2xl font-bold  uppercase text-center mx-[10%]">
                    {authText}
                </p>
            </section>
            {/* Form Section */}
            <form
                onSubmit={handleSubmit}
                className={`space-y-4 flex flex-col w-full max-w-md shadow-xl bg-zinc-900  p-12 rounded-md max-xl:order-2`}
            >
                {/* Name Field (Only for SignUp) */}
                {showNameField && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder=" "
                            required
                            className="peer block w-full border border-gray-300 rounded-md pl-10 pt-4 pb-4 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent text-white"
                            name="name"
                            value={formData.name || ""}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete="off"
                        />
                        <User size={20} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        <label className={`absolute left-10 px-1 bg-zinc-900 text-gray-500 transition-all duration-200 ease-in-out pointer-events-none 
                        -top-2 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs`}>
                            Full Name
                        </label>
                    </div>
                )}

                {/* Email Field */}
                <div className="relative">
                    <input
                        type="email"
                        placeholder=" "
                        required
                        className="peer block w-full border border-gray-300 rounded-md pl-10 pt-4 pb-4 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent text-white"
                        name="email"
                        value={formData.email || ""}
                        onChange={(e) => handleInputChange(e)}
                        autoComplete="off"
                    />
                    <Mail size={20} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    <label className={`absolute left-10 px-1 bg-zinc-900 text-gray-500 transition-all duration-200 ease-in-out pointer-events-none 
                     -top-2 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs`}>
                        Email
                    </label>
                </div>

                {/* Password Field */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder=" "
                        required
                        className="peer block w-full border border-gray-300 rounded-md pl-10 pt-4 pb-4 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent"
                        name="password"
                        value={formData.password || ""}
                        onChange={(e) => handleInputChange(e)}
                        autoComplete="off"
                    />
                    <Lock size={20} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    <label className={`absolute left-10 px-1 bg-zinc-900 text-gray-500 transition-all duration-200 ease-in-out pointer-events-none 
                     -top-2 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs`}>
                        Password
                    </label>
                    <button className="absolute bottom-[1.2rem] right-3 text-xl" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>

                </div>
                {/* Confirm Password Field */}
                {
                    showNameField && (
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                required
                                className="peer block w-full border border-gray-300 rounded-md pl-10 pt-4 pb-4 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent text-white"
                                name="confirmPassword"
                                value={formData.confirmPassword || ""}
                                onChange={(e) => handleInputChange(e)}
                                autoComplete="off"
                            />
                            <Lock size={20} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <label className={`absolute left-10 px-1 bg-zinc-900 text-gray-500  transition-all duration-200 ease-in-out pointer-events-none 
                     -top-2 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs`}>
                                Confirm Password
                            </label>

                            <button className="absolute bottom-[1.2rem] right-3 text-xl" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>

                        </div>
                    )
                }


                {/* Role Selection (Only for Admins) */}
                {showNameField && (
                    <div className="relative">
                        <select
                            name="role"
                            className={`block w-full border border-gray-300 rounded-md p-3 bg-zinc-900 text-white`}
                            value={formData.role || "user"}
                            onChange={handleInputChange}
                        >
                            <option value="user" className={`bg-zinc-900 text-white}`}>User</option>
                            <option value="admin" className={`bg-zinc-900 text-white}`}>Admin</option>
                        </select>
                        <label className={`absolute left-10 px-1 -top-2 text-xs bg-zinc-900 text-gray-500`}>
                            Role
                        </label>
                    </div>
                )}




                <button type="submit" className={`${showNameField ? "bg-green-600 hover:bg-green-700" : "bg-sky-600 hover:bg-sky-700"}  text-white py-2  rounded-md hover:cursor-pointer`}>
                    {loading ? "Loading..." : submitText}
                </button>
                {
                    isGuest && (
                        <>
                            <button
                                onClick={handleGuestLogin}
                                type="button" className="bg-red-800 py-2 text-white rounded-md hover:cursor-pointer hover:bg-red-900">
                                {loading ? "Loading..." : "Login as Guest"}

                            </button>
                            <button 
                            className="common-login-btn" 
                            onClick={handleLoginWithGoogle}
                            >
                                <span>
                                    Login with Google
                                </span>
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.36 0 6.39 1.15 8.76 3.04l6.52-6.52C34.67 2.55 29.67 0 24 0 14.64 0 6.57 5.7 2.64 14.02l7.79 6.06C12.03 13.4 17.58 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.1 24.56c0-1.56-.14-3.05-.39-4.5H24v8.5h12.5c-.54 2.85-2.18 5.26-4.62 6.92l7.36 5.73C43.81 37.04 46.1 31.25 46.1 24.56z" />
                                    <path fill="#FBBC05" d="M10.43 28.08A14.87 14.87 0 019.5 24c0-1.42.2-2.8.57-4.08l-7.79-6.06A23.933 23.933 0 000 24c0 3.83.92 7.45 2.57 10.61l7.86-6.53z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.91-2.14 15.88-5.8l-7.36-5.73C30.71 37.39 27.55 38.5 24 38.5c-6.41 0-11.96-3.9-13.57-9.57l-7.86 6.53C6.57 42.3 14.64 48 24 48z" />
                                </svg>
                            </button>
                            <button
                                className="common-login-btn"
                                onClick={handleLoginWithGithub}
                            >
                                <span>
                                    Login with github
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor"  viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                            </button>
                        </>
                    )
                }
                <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-400"></div>
                    <span className="px-2 text-gray-600 font-medium">OR</span>
                    <div className="flex-1 border-t border-gray-400"></div>
                </div>
                {
                    isGuest && (
                        <NavLink to="/forgot-password" className="text-center hover:text-blue-400">Forgot Password?</NavLink>
                    )
                }

                <p className="text-center text-md">
                    {redirectText}{" "}
                    <NavLink to={redirectLink} className={`${!showNameField ? "text-green-700 hover:text-green-800" : "text-sky-700 hover:text-sky-800"}`}>
                        {redirectLinkText}
                    </NavLink>
                </p>
            </form>

        </section>
    );
};

export default AuthForm;
