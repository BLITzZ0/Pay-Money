/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import Heading from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";

export function SignupForm() {
  const [user_name, setUserName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <Heading label="Sign Up" />
        <SubHeading label="Enter your information to create an account" />

        <div className="space-y-4 mt-4">
          <InputBox
            onChange={(e) => setUserName(e.target.value)}
            label="Email (Username)"
            placeholder="Enter Email (Username)"
          />

          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            label="First Name"
            placeholder="Enter your First Name"
          />

          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
            placeholder="Enter your Last Name"
          />

          <InputBox
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your Password"
          />

          <InputBox
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            placeholder="Confirm your Password"
          />
        </div>

        <div className="mt-6">
          <Button  label="Create Account"   onClick={() => {
            if(password === confirm_password){
                axios.post(`${API_URL}/api/v1/user/add_user`, {
                User_name: user_name,
                first_name,
                Last_name: last_name,
                Password: password
              })
              .then((res) => {
                // console.log(res.data);
                alert("User Created Sucessfully")
                navigate("/login")
              })
              .catch(err => console.error(err.response?.data || err));
              
            }
            else{
              alert("Password Mismatched")
            }}}/>
        </div>

        <div className="mt-4 text-center">
          <BottomWarning
            label="Already have an Account?"
            buttontext="Log in"
            to="/login"
          />
        </div>
      </div>
    </div>
  );
}
