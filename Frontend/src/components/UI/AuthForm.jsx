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
        return navigate("/");

    }

    const handleGuestLogin = () => {
        dispatch(updateFormData({ email: "example@gmail.com", password: "000000" }));
    }

    return (
        <section className={`min-h-screen flex flex-col justify-center gap-8 items-center bg-zinc-950  max-sm:px-4`}>
            <section className="flex flex-col justify-center items-center max-xl:order-1">
                <p className="text-2xl font-bold  uppercase text-center mx-[10%]">
                    {authText}
                </p>
            </section>
            {/* Form Section */}
            <form
                onSubmit={handleSubmit}
                className={`space-y-6 flex flex-col w-full max-w-md shadow-xl bg-zinc-900  p-12 rounded-md max-xl:order-2`}
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
                        <button
                            onClick={handleGuestLogin}
                            type="button" className="bg-red-400 py-2 text-black rounded-md hover:cursor-pointer hover:bg-red-500">
                            {loading ? "Loading..." : "Login as Guest"}
                        </button>
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
