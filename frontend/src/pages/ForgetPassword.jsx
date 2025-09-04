import { useState } from "react";
import axios from "axios";
import Heading from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { OtpBox } from "../components/OtpBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";

export function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [Email, setEmail] = useState("");
  const [Otp, setOtp] = useState("");
  const [Password, setPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const API = import.meta.env.VITE_API_URL;


  // Step 1: Request OTP
  const handleGetOtp = async () => {
    try {
      if (!Email) {
        alert("Please enter your email");
        return;
      }
      const res = await axios.post(`${API}/forget-password`, { email: Email });
      alert(res.data.Message);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  // Step 2: Verify OTP (move to password reset step)
  const handleVerifyOtp = () => {
    if (!Otp) {
      alert("Please enter OTP");
      return;
    }
    setStep(3); 
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    try {
      if (!Password || !RePassword) {
        alert("Please fill all fields");
        return;
      }
      if (Password !== RePassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await axios.post(`${API}/reset-password`, {
        email: Email,
        otp: Otp,
        newPassword: Password,
      });

      alert(res.data.Message);
      // Optional: redirect to login
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <Heading label="Reset Password" />
        <SubHeading label="Follow the steps to reset your password" />

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <div className="space-y-4 mt-4">
            <InputBox
              label="Enter your Email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button label="Get OTP" onClick={handleGetOtp} />
          </div>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <div className="space-y-4 mt-4">
            <OtpBox label="Enter OTP" length={6} onChange={(otp) => setOtp(otp)} />
            <Button label="Verify OTP" onClick={handleVerifyOtp} />
          </div>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <div className="space-y-4 mt-4">
            <InputBox
              label="Enter New Password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputBox
              label="Re-Enter Your Password"
              placeholder="Reenter Password"
              onChange={(e) => setRePassword(e.target.value)}
            />
            <Button label="Reset Password" onClick={handleResetPassword} />
          </div>
        )}

        {/* Bottom Links */}
        <div className="mt-4 text-center">
          <BottomWarning label="Remembered your password?" buttontext="Log In" to="/login" />
          <BottomWarning label="Don’t have an account?" buttontext="Create One" to="/signup" />
        </div>
      </div>
    </div>
  );
}
