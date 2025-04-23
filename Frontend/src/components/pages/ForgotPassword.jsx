import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/user/forgot-password", { email });
      toast.success(data.message || "Reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex  justify-center p-4">
      <form onSubmit={handleForgotPassword} className="bg-gray-800 h-fit rounded-lg px-6 py-12 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Forgot Password</h2>
        <label className="block text-gray-300 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition duration-300"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
