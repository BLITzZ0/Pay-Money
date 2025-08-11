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
        </div>
    );
}