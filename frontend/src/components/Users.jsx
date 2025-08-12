import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from "react-router-dom";


export const Users = () => {
    const [users, setUsers] = useState([]);
    const [logged_In_User, setlogged_In_User] = useState("");
    const [filter, setFilter] = useState("");
    const navigate=useNavigate();
    const token = localStorage.getItem("token");
    

    useEffect(() => {
        if(!token){
        navigate("/login");
        return;
        }
        const delayDebounce = setTimeout(()=>{
            try{
            const decoded_user = jwtDecode(token);
            console.log("Decoded token:", decoded_user);
            setlogged_In_User(decoded_user.User_name);

            axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {   
                const filteredUser = response.data.users.filter(user => user.User_name !== decoded_user.User_name);
                setUsers(filteredUser || []);
            })
            .catch(err => {
                console.error("Error Fetching Users: ", err);
            });
            }catch(err){
                console.error("Invalid Token",err);
                navigate("/login")
            }
        },500);
        return () =>clearTimeout(delayDebounce)
    }, [token,filter,navigate]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <div className="font-bold text-2xl text-gray-800 mb-6">
                Users
            </div>
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    onChange={(e)=>{
                        setFilter(e.target.value)
                    }}
                />
                <svg 
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div className="space-y-4">
                {users.length > 0 ? (
                    users.filter(user => logged_In_User !== user.User_name)
                        .map((user, index) => (
                            <User key={index} user={user} />
                        ))
                ) : (
                    <p className="text-gray-500 text-center">No users found</p>
                )}
            </div>
            <button onClick={()=>{
                localStorage.removeItem("token");
                navigate("/login")
            }}>
                Log Out
            </button>
        </div>
    );
};

function User({ user }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-4">
                <div className="rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-lg shadow-inner">
                    {user.first_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">
                        {user.first_name || "Unknown"} {user.last_name || ""}
                    </h3>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                        {user.User_name}
                    </p>
                </div>
            </div>
            <div>
                <Button 
                    label={"Send Money"} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                />
            </div>
            
        </div>
    );
}
