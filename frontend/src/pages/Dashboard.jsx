import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
    return (
        <div className="h-screen flex bg-gradient-to-bl  from-gradientEnd to-gray-600/20">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-purple-400 mb-6">
                        Dashboard
                    </h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-gray-700/30 rounded-md shadow p-6">
                            <h3 className="text-lg font-semibold text-purple-300">
                                Card 1
                            </h3>
                            <p className="text-gray-300 mt-2">
                                Some stats or content here.
                            </p>
                        </div>
                        <div className="bg-gray-700/30 rounded-md shadow p-6">
                            <h3 className="text-lg font-semibold text-purple-300">
                                Card 2
                            </h3>
                            <p className="text-gray-300 mt-2">
                                Some stats or content here.
                            </p>
                        </div>
                        <div className="bg-gray-700/30 rounded-md shadow p-6">
                            <h3 className="text-lg font-semibold text-purple-300">
                                Card 3
                            </h3>
                            <p className="text-gray-300 mt-2">
                                Some stats or content here.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
