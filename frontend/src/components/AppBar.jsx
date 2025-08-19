import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function AppBar() {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.first_name || "");
    } catch (err) {
      console.error("Invalid Token", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
        Swal.fire("Logged out!", "You have been successfully logged out.", "success");
      }
    });
  };

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="text-xl font-bold text-blue-600">Pay-Money App</div>

      <div className="flex items-center space-x-6">
        <div className="text-gray-600 font-medium">Hello, {username}</div>
        <div className="relative">
          <div className="rounded-full h-10 w-10 bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-lg shadow-inner">
            {username ? username.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
