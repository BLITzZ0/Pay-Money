import { useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import axios, { AxiosHeaders } from "axios";
import { jwtDecode } from "jwt-decode";

export function Dashboard(){
    const token = localStorage.getItem("token");
    const [balance, setBalance]=useState(0);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!token){
            navigate("/login");
            return;
        }
        try{
            const Decoded = jwtDecode(token)
            const current_time = Date.now()/1000;
            if(Decoded && Decoded.exp < current_time){
                localStorage.removeItem("token");
                navigate("/login")
            }
        }catch(err){
            console.error("Invalid request",err);
            localStorage.removeItem("token");
            navigate("/login")
        }
    },[navigate,token])

    useEffect(()=>{
        if(!token) return;
        axios.post("https://pay-money.onrender.com/api/v1/account/balance",{},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(res=>{
            setBalance(res.data.Balance);
            // console.log(balance)
        })
        .catch(err=>{
            console.error("Error Fetching Balance",err)
        })
    },[token,balance])

    return <div>
        <AppBar />
        <div className="mt-8 relative left-3">
            <Balance value = {balance}/>
            <Users />
        </div>
    </div>
}