import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BarChart2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`${
                collapsed ? "w-20" : "w-64"
            }  text-white border-r border-gray-50/10 bg-gradient-to-br from-black/20 to-gray-600/10 flex flex-col p-4 transition-all duration-300`}
        >
            {/* Toggle button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute self-end mb-6 p-1 rounded hover:bg-purple-700"
            >
                {collapsed ? (
                    <ChevronRight size={20} />
                ) : (
                    <ChevronLeft size={20} />
                )}
            </button>

            {/* Brand */}
            {!collapsed && <h2 className="text-2xl font-bold mb-10">User Authentication</h2>}
            {collapsed && <h2 className="text-2xl font-bold mb-10"></h2>}

            {/* Navigation */}
            <nav className="flex flex-col space-y-4">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg ${
                            isActive ? "bg-purple-700" : "hover:bg-purple-700"
                        }`
                    }
                >
                    <LayoutDashboard size={20} />
                    {!collapsed && <span>Dashboard</span>}
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg ${
                            isActive ? "bg-purple-700" : "hover:bg-purple-700"
                        }`
                    }
                >
                    <BarChart2 size={20} />
                    {!collapsed && <span>Analytics</span>}
                </NavLink>
            </nav>
        </aside>
    );
}
