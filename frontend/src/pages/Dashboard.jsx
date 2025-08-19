import { useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function Dashboard() {
  const token = localStorage.getItem("token");
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Check JWT validity
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const Decoded = jwtDecode(token);
      const current_time = Date.now() / 1000;
      if (Decoded && Decoded.exp < current_time) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Invalid request", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, token]);

  // Fetch balance
  useEffect(() => {
    if (!token) return;
    axios
      .post(
        `${API_URL}/api/v1/account/balance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setBalance(res.data.Balance);
      })
      .catch((err) => {
        console.error("Error Fetching Balance", err);
      });
  }, [token, API_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <div className="max-w-4xl mx-auto mt-10 px-4 space-y-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
}
