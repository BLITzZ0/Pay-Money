import Heading from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Login() {
const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const navigate = useNavigate();
// console.log(username, password)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <Heading label="Log In" />
        <SubHeading label="Enter your credentials to continue" />

        <div className="space-y-4 mt-4">
          <InputBox label="Email or username" placeholder="Enter your Email or username" onChange={(e)=>setUsername(e.target.value)} />
          <InputBox label="password" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)} />
        </div>

        <div className="mt-6">
          <Button label="Login" onClick={async ()=>{
           try{
              if(!username || !password){
                alert("Please fill in both username and password");
                return;
              }
              const login = await axios.post("https://pay-money.onrender.com/api/v1/user/login_user",
                {
                User_name : username,
                Password : password
                }
              );

              if(login.data.token){
                localStorage.setItem("token",login.data.token);
                navigate("/dashboard");
              }else{
                alert("Invalid Credential");
              }
           }catch(err){
            console.log(err)
            alert(err.response?.data?.message || "Login Failed")
           }
          }}/>
        </div>

        <div className="mt-4 text-center">
          <BottomWarning
            label="Don't have an Account?"
            buttontext="Create One"
            to="/signup"
          />
        </div>
      </div>
    </div>
  );
}
