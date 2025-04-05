    import { Navigate, useLocation } from "react-router-dom";
    import { toast } from "react-toastify";

    const ProtectedRoute = ({ user, children, authChecked }) => {
    const location = useLocation();

    if (!authChecked) return null; // 🔹 Prevents rendering before auth check is done

    if (!user) {
        toast.error("Please log in first");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
    };

    export default ProtectedRoute;
