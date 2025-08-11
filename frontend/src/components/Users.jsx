import { Button } from "./Button"

const users = [
  {
    _id: { $oid: "6889e194df81c8729bff62c4" },
    User_name: "ababhishek3005@gmail.com",
    first_name: "Abhishek",
    Last_name: "Pandey",
    Password: "$2b$10$fQ6bskHJ1itLVT.VLFfsZ.VgAsPKmVlStGOruYd9/b4dt2kQfvll.",
    __v: 0,
  },
  {
    _id: { $oid: "6889e194df81c8729bff62c5" },
    User_name: "example2@gmail.com",
    first_name: "John",
    Last_name: "Doe",
    Password: "somepasswordhash",
    __v: 0,
  },
];

export const Users = () => {
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
                />
                <svg 
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div className="space-y-4">
                {(users || []).map((user) => (
                    // <User key={user._id} user={user} />
                    <User key={user._id.$oid} user={user} />

                ))}
            </div>
        </div>
    );
}

function User({ user }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-4">
                <div className="rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-lg shadow-inner">
                    {user.first_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">
                        {user.first_name || "Unknown"} {user.Last_name || ""}
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