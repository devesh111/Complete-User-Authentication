import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AnalyticsPage() {
    return (
        <div className="h-screen flex bg-gradient-to-bl  from-gradientEnd to-gray-600/20">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-purple-400 mb-6">
                        Analytics
                    </h2>
                    <div className="bg-gray-700/30 rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-purple-400">
                            Traffic Overview
                        </h3>
                        <p className="text-gray-300 mt-2">
                            Placeholder for charts or analytics data.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
