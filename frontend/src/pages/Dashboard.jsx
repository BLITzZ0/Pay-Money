import { useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import axios, { AxiosHeaders } from "axios";

export function Dashboard(){
    const token = localStorage.getItem("token");
    const [balance, setBalance]=useState(0);
    const navigate = useNavigate();
    useEffect(()=>{
        
        if(!token){
            navigate("/login");
            return;
        }
    },[navigate,token])

    useEffect(()=>{
        if(!token) return;
        axios.post("http://localhost:3000/api/v1/account/balance",{},{
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