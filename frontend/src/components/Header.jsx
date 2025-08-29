import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync } from "../store/authSlice";
import { User } from "lucide-react";

export default function Header() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    console.log(user);
    return (
        <header className="flex justify-between items-center border border-gray-50/10 bg-black/20 text-white px-6 py-4 mt-2 shadow-md max-w-4xl w-full rounded-full m-auto">
            {/* App Name */}
            <h1 className="text-xl font-bold">User Authentication</h1>

            {/* User Menu */}
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-purple-700"
                >
                    <User size={22} />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-700/50 text-gray-300 rounded-md shadow-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-600">
                            <p className="font-semibold">
                                {user?.username || "Guest"}
                            </p>
                            <p className="text-sm text-gray-400">
                                {user?.email || ""}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <button
                                className="px-4 py-2 text-left hover:bg-gray-100"
                                onClick={() =>
                                    alert("Profile page coming soon")
                                }
                            >
                                Profile
                            </button>
                            <button
                                className="px-4 py-2 text-left hover:bg-gray-100 text-purple-300"
                                onClick={() => dispatch(logoutAsync())}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
