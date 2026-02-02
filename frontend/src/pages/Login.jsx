import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaBrain, FaTerminal } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            navigate("/");
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade">
            <div className="auth-card glass">
                <div className="auth-header">
                    <div className="brain-orb" style={{ margin: '0 auto' }}>
                        <FaBrain size={30} color="var(--primary)" />
                    </div>
                    <h2>LOGIN_SEQUENCE</h2>
                    <p>Enter your credentials to access the AI Terminal</p>
                </div>

                {error && (
                    <div className="terminal-error" style={{ marginBottom: '1.5rem', borderRadius: '8px' }}>
                        [AUTH_ERROR]: {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>USER_IDENTITY</label>
                        <div className="auth-input-wrapper">
                            <FaEnvelope className="icon" />
                            <input
                                type="email"
                                placeholder="name@neurointel.ai"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>ACCESS_CODE</label>
                        <div className="auth-input-wrapper">
                            <FaLock className="icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "AUTHENTICATING..." : "EXECUTE_LOGIN_SEQUENCE"}
                    </button>
                </form>

                <div className="auth-footer">
                    NEW_OPERATOR? <Link to="/signup">REGISTER_IDENTITY</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
