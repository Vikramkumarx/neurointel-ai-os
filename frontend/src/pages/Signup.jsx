import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaBrain } from "react-icons/fa";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await register(username, email, password);
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
                    <h2>REGISTER_IDENTITY</h2>
                    <p>Initialize a new operator account</p>
                </div>

                {error && (
                    <div className="terminal-error" style={{ marginBottom: '1.5rem', borderRadius: '8px' }}>
                        [REGISTRATION_ERROR]: {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>OPERATOR_NAME</label>
                        <div className="auth-input-wrapper">
                            <FaUser className="icon" />
                            <input
                                type="text"
                                placeholder="Specialist Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                        {loading ? "INITIALIZING..." : "EXECUTE_REGISTRATION"}
                    </button>
                </form>

                <div className="auth-footer">
                    CLINICAL_ACCESS_ENABLED? <Link to="/login">PROCEED_TO_LOGIN</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
