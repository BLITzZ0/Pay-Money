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


// Now use normalizedUsers in your component


export const Users = () => {

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {(users || []).map((user) => (
                    <User key={user._id} user={user} />
                ))}
            </div>
        </>
    );
}

function User({ user }) {

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.first_name?.[0] || "?"}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.first_name || "Unknown"} {user.last_name || ""}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button label={"Send Money"}/>
            </div>
        </div>
    );
}
