import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AppBar() {
    const token = localStorage.getItem("token");
    const [username,setUsername] = useState("");
    const Navigate = useNavigate()
    useEffect(()=>{
        if(!token){
            Navigate("/login");
            return;
        }
        try{
            const Decode = jwtDecode(token);
            setUsername(Decode.User_name);
        }catch(err){
            console.error("Invalid Token",err)
        }
    },[token,Navigate])

    return (
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-blue-600">
                    Pay-Money App
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-gray-600 font-medium">
                    Hello, {username ? username : ""}
                </div>
                <div className="relative">
                    <div className="rounded-full h-10 w-10 bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-lg shadow-inner">
                        {username.toUpperCase()[0]}
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
            </div>
        </div>
    );
}
