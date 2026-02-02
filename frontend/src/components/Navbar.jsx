import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPowerOff, FaBrain } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar glass">
            <div className="nav-brand">
                <FaBrain />
                <span>NEUROINTEL OS</span>
            </div>

            <div className="nav-links">
                {user ? (
                    <>
                        <div className="user-profile glass" style={{ padding: '0.4rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <FaUserCircle size={20} color="var(--primary)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px' }}>{user.username.toUpperCase()}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ background: 'rgba(255, 62, 62, 0.1)', border: 'none', color: 'var(--danger)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                            title="TERMINATE SESSION"
                        >
                            <FaPowerOff size={18} />
                        </button>
                    </>
                ) : (
                    <span className="user-greeting" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '800', letterSpacing: '2px' }}>
                        AUTHENTICATION REQUIRED
                    </span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
