import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshToken, checkAuth } from "./store/authSlice";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import OAuthCallback from "./pages/OAuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(refreshToken());
        dispatch(checkAuth());
    }, [dispatch]);

    if(status == "idle") {
        return <div className="text-center mt-10 text-white">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AnalyticsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
