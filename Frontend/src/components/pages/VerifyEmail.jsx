import React, { useState, useEffect } from "react";
import { getEmailVerificationEmail, sendOTP } from "../../API/api";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [hasSent, setHasSent] = useState(false);
  const [sendOtpLoading,setSendOtpLoading] = useState(false)
  const [submitButtonLoading,setSubmitButtonLoading] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    let interval;
    if (hasSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasSent, timer]);

  const handleSendOtp = async() => {
    setSendOtpLoading(true);
    try {
        await getEmailVerificationEmail()
        setHasSent(true);
        setTimer(60);
        
    } catch (error) {
        console.log(error);
        
    }finally{
        setSendOtpLoading(false);
    }
  };

  const handleSubmit = async(e) => {
      e.preventDefault();
      setSubmitButtonLoading(true);
      try {
       await sendOTP(otp);
       setSubmitButtonLoading(false);
       navigate("/profile"); 
       window.location.reload();
    } catch (error) {
        console.log(error);
        
    }finally{
        setSubmitButtonLoading(false)
    }
  };

  const renderButtonText = () => {
    if (sendOtpLoading) {
        return (
          <span className="flex items-center justify-center gap-2">
            Sending OTP <Loader2 className="animate-spin w-4 h-4" />
          </span>
        );
    }
    if (!hasSent) return "Send OTP";
    if (timer === 0) return "Resend Code";
    return `Send OTP (${timer}s)`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center [background:radial-gradient(circle_at_center,_#1f1b2e_0%,_#15131e_60%,_#0e0c15_100%)] px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md text-center space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Verify Your Email</h2>
        <p className="text-gray-600">
          We have sent an OTP to <span className="font-medium text-blue-600">{email}</span>
        </p>

        <button
          onClick={handleSendOtp}
          disabled={hasSent && timer > 0 &&sendOtpLoading}
          className={`w-full py-2 rounded-xl font-semibold transition flex items-center justify-center  ${
            hasSent && timer > 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {renderButtonText()}
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={otp}
            name="token"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={8}
            autoComplete="off"
          />
          {
            submitButtonLoading ? (
              <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              Verify Code <Loader2 className="animate-spin w-4 h-4" />
            </button>
            ) : (
                <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
              >
                Verify Code
              </button>
            )
          }
          
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
