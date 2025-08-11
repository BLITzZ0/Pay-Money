export function Balance({ value }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-baseline">
                <div className="text-gray-700 font-medium text-lg">
                    Your balance is
                </div>
                <div className="ml-3 text-2xl font-bold text-gray-900">
                    ₹{value}
                </div>
            </div>
            <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600" 
                    style={{ width: `${Math.min(100, Math.max(0, (value / 10000) * 100))}%` }}
                ></div>
            </div>
        </div>
    );
}