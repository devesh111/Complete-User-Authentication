import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }) {
    const { access, status } = useSelector((s) => s.auth);
    if (status === "loading" && !access)
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    if (!access) return <Navigate to="/login" replace />;
    return children;
}
