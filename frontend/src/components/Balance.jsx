import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export function Balance({ value }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-6">
            <div className="flex items-baseline">
                <div className="text-gray-700 font-medium text-lg">
                    Your balance is
                </div>
                <div className="ml-3 text-2xl font-bold text-gray-900">
                    ₹{value}
                </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" onClick={()=>navigate("#")}>
                View Transaction
            </button>
        </div>
    );
}
