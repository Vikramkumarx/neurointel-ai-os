import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./index.css";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-wrapper">
                    <Navbar />
                    <div className="container">
                        <Routes>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/login" element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            } />
                            <Route path="/signup" element={
                                <PublicRoute>
                                    <Signup />
                                </PublicRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
