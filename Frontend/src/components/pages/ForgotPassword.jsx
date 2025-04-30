import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import toastConfig from "../../config/toastConfig";
import {useNavigate} from "react-router-dom"
import { Loader, SpaceIcon } from "lucide-react";
import {postEmailToForgotPassword} from "../../API/api.js"
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate =  useNavigate()
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postEmailToForgotPassword(email);
      setEmail("")
    } catch (error) {
      console.log(error);

      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
      setEmail("");
      
    }
  };

  return (
    <div className="min-h-screen text-black bg-[radial-gradient(circle_at_center,_#1f1b2e_0%,_#15131e_60%,_#0e0c15_100%)] flex  justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-fit mt-20">
        <h2 className="text-3xl text-center  mb-4">Forgot Password</h2>
        <p className=" text-center mb-6">Enter your email to reset your password.</p>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-indigo-700 flex gap-2 items-center justify-center  rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? <span className="flex gap-2 items-center">Sending...<Loader className="animate-spin"/></span>: "Send Reset Link"}
          </button>
        </form>

        {message && <p className="text-center text-green-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
