import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, postNewPassword } from "../../API/api";
import { EyeIcon, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validToken, setValidToken] = useState(null);

  // Check token validity as soon as the component is mounted
  useEffect(() => {
    const checkToken = async () => {
      try {
        const success = await getToken(token);
        console.log(success);
        
        if (success) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      } catch (err) {
        setValidToken(false);
      }
    };

    checkToken();
  }, []);  // Dependency on token, will run when token changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await postNewPassword(newPassword, confirmPassword, token);

      if (res.success) {
        setSuccess("Password updated successfully. Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.log(err);
      
    }
  };

  if (validToken === null) return <section className="min-h-screen min-w-screen"><p className="text-xl text-center mt-10">Checking token...</p></section>;
  if (!validToken) return <section className="min-h-screen min-w-screen"><p className="text-xl text-center mt-10">Invalid or expired token</p></section>;

  return (
    <section className="min-h-screen min-w-screen">

    <div className=" mx-auto mt-10 p-6 border h-fit  w-fit rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full border px-3 py-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="off"
            />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
            >
            {showNewPassword ? <EyeOff /> : <EyeIcon />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
            required
            />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
            >
            {showConfirmPassword ? <EyeOff /> : <EyeIcon />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
          Reset Password
        </button>
      </form>
    </div>
            </section>
  );
};

export default ResetPassword;
