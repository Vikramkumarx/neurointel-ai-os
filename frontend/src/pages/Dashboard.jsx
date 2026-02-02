import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import UploadModal from "../components/UploadModal";
import VideoPlayer from "../components/VideoPlayer";
import VideoCard from "../components/VideoCard";
import io from "socket.io-client";
import * as Icons from "react-icons/fa";

const Dashboard = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [socket, setSocket] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ scans: 0, accuracy: 98.4, processed: 0 });
    const [logs, setLogs] = useState([
        "[SYSTEM] Boot sequence initialized...",
        "[AUTH] Operator authenticated: " + (user?.username || "Guest"),
        "[NETWORK] Secure link established with Quantum Node #7"
    ]);
    const [activeAnalysis, setActiveAnalysis] = useState("");

    // Safe Icon Retrieval
    const getIcon = (name, size = 20, color = 'currentColor', className = '') => {
        const IconComponent = Icons[name];
        return IconComponent ? <IconComponent size={size} color={color} className={className} /> : null;
    };

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        setLogs(prev => [...prev.slice(-12), `[${time}] ${msg}`]);
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/videos");
                const safeData = Array.isArray(data) ? data : [];
                setVideos(safeData);
                if (safeData.length > 0 && !selectedVideo) {
                    setSelectedVideo(safeData[0]);
                }
                setStats(s => ({
                    ...s,
                    scans: safeData.length,
                    processed: safeData.filter(v => v.status === 'processed').length
                }));
                setError(null);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Terminal Link Failure: Could not reach AI server.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();

        const newSocket = io("http://127.0.0.1:5000", { transports: ["websocket"] });
        setSocket(newSocket);

        return () => { if (newSocket) newSocket.close(); };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("videoProgress", ({ videoId, progress, phase }) => {
                setVideos((prev) => (prev || []).map((v) => v._id === videoId ? { ...v, progress, phase } : v));
                if (phase) setActiveAnalysis(phase);
                if (progress % 20 === 0) addLog(`[AI] ${phase || 'ANALYZING'}: ${progress}%`);
            });
            socket.on("videoStatus", ({ videoId, status, findings }) => {
                setVideos((prev) => (prev || []).map((v) => v._id === videoId ? { ...v, status, analysisResults: findings } : v));
                addLog(`[SYSTEM] Sequence ${videoId.slice(-4).toUpperCase()} analysis complete: ${status.toUpperCase()}`);
                setActiveAnalysis("");
            });
        }
    }, [socket]);

    const handleUploadSuccess = async () => {
        addLog("[UPLOAD] New mri sequence detected. Initializing decoder...");
        const { data } = await api.get("/videos");
        setVideos(Array.isArray(data) ? data : []);
    };

    const handleDelete = async (videoId) => {
        if (!window.confirm("Purge clinical record? This action is irreversible.")) return;
        try {
            await api.delete(`/videos/${videoId}`);
            const updated = (videos || []).filter(v => v._id !== videoId);
            setVideos(updated);
            addLog(`[SECURITY] Record NS-${videoId.slice(-4).toUpperCase()} purged from archives.`);
            if (selectedVideo?._id === videoId) {
                setSelectedVideo(updated.length > 0 ? updated[0] : null);
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const filteredVideos = (videos || []).filter(v =>
        (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="startup-container">
            <div className="scanner-line"></div>
            {getIcon('FaBrain', 60, 'var(--primary)', 'animate-pulse')}
            <h2 style={{ marginTop: '2rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'white' }}>NeuroIntel OS 2.0 Initializing...</h2>
            <p style={{ color: 'var(--primary)', marginTop: '1rem', opacity: 0.6 }}>Synchronizing Neural Networks...</p>
        </div>
    );

    return (
        <div className="dashboard animate-fade">
            <header className="dashboard-header-premium">
                <div className="brand-zone">
                    <div className="brain-orb">
                        {getIcon('FaBrain', 24, 'var(--primary)')}
                    </div>
                    <div>
                        <h1 className="glitch-text" data-text="NEUROINTEL AI">NEUROINTEL AI</h1>
                        <div className="system-status">
                            <span className="status-dot"></span> SYSTEM ACTIVE // CORE_TEMP: 42°C
                        </div>
                    </div>
                </div>

                <div className="header-actions">
                    <div className="search-box-premium glass">
                        {getIcon('FaSearch', 18, 'var(--primary)', 'icon')}
                        <input
                            type="text"
                            placeholder="SEARCH PATIENT ARCHIVES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <UploadModal onUploadSuccess={handleUploadSuccess} />
                </div>
            </header>

            <section className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-header">{getIcon('FaMicroscope', 14)} TOTAL ARCHIVES</div>
                    <div className="stat-value">{stats.scans}</div>
                    <div className="stat-footer">Database Sector: 4</div>
                </div>
                <div className="stat-card glass accent">
                    <div className="stat-header">{getIcon('FaRobot', 14)} AI CONFIDENCE</div>
                    <div className="stat-value">{stats.accuracy}%</div>
                    <div className="stat-footer">Quantum Model V7.2</div>
                </div>
                <div className="stat-card glass success">
                    <div className="stat-header">{getIcon('FaShieldAlt', 14)} SECURE NODES</div>
                    <div className="stat-value">{stats.processed}</div>
                    <div className="stat-footer">Verified Clinical Data</div>
                </div>
                <div className="stat-card glass primary">
                    <div className="stat-header">{getIcon('FaBolt', 14)} QUANTUM SYNC</div>
                    <div className="stat-value">92.4%</div>
                    <div className="stat-footer">Neural Link Active</div>
                </div>
            </section>

            <div className="main-layout-premium">
                <main className="primary-view">
                    {selectedVideo ? (
                        <div className="glass diagnostic-container">
                            <div className="corner-decor top-left"></div>
                            <div className="corner-decor top-right"></div>

                            <div className="diagnostic-player">
                                {selectedVideo.status === 'processed' || selectedVideo.status === 'flagged' ? (
                                    <VideoPlayer video={selectedVideo} key={selectedVideo._id} />
                                ) : (
                                    <div className="processing-overlay">
                                        <div className="scanning-bar"></div>
                                        {getIcon('FaDna', 80, 'var(--primary)', 'dna-spin')}
                                        <h3 style={{ color: 'white', marginTop: '1rem' }}>{activeAnalysis || "EXTRACTING NEURAL PATTERNS..."}</h3>
                                        <div className="progress-strip">
                                            <div className="fill" style={{ width: `${selectedVideo.progress || 0}%` }}></div>
                                        </div>
                                        <p style={{ color: 'var(--primary)' }}>{selectedVideo.progress || 0}% SYNCING DATA</p>
                                    </div>
                                )}
                            </div>

                            <div className="diagnostic-details">
                                <div className="detail-header">
                                    <h2 style={{ color: 'white' }}>{selectedVideo.title}</h2>
                                    <div className={`verification-badge ${selectedVideo.status === 'flagged' ? 'danger' : ''}`}>
                                        {selectedVideo.status === 'flagged' ? getIcon('FaExclamationTriangle', 12) : getIcon('FaLock', 12)}
                                        {selectedVideo.status === 'flagged' ? 'ANOMALY DETECTED' : 'SECURE ARCHIVE'}
                                    </div>
                                </div>

                                <div className="patient-meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div className="meta-item">
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>PATIENT_AGE</span>
                                        <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold' }}>{selectedVideo.patientData?.age || "N/A"}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>BLOOD_TYPE</span>
                                        <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold' }}>{selectedVideo.patientData?.bloodType || "N/A"}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>SCAN_PHASE</span>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>{selectedVideo.patientData?.phase || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="hu-metric-grid">
                                    <div className="hu-metric-card">
                                        <span className="label">AI Confidence</span>
                                        <span className="value">{selectedVideo.analysisResults?.confidence || "98.4"}%</span>
                                    </div>
                                    <div className="hu-metric-card" style={{ borderLeftColor: selectedVideo.status === 'flagged' ? 'var(--danger)' : 'var(--accent)' }}>
                                        <span className="label">Anomaly Score</span>
                                        <span className="value">{selectedVideo.analysisResults?.anomalyScore || "0.002"}</span>
                                    </div>
                                    <div className="hu-metric-card" style={{ borderLeftColor: 'var(--success)' }}>
                                        <span className="label">Neural Depth</span>
                                        <span className="value">88.5 MU</span>
                                    </div>
                                    <div className="hu-metric-card" style={{ borderLeftColor: 'var(--secondary)' }}>
                                        <span className="label">Analysis Time</span>
                                        <span className="value">10.2s</span>
                                    </div>
                                </div>

                                <div className="brain-wave-container">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s`, opacity: selectedVideo.status === 'flagged' ? 1 : 0.6, background: selectedVideo.status === 'flagged' ? 'var(--danger)' : 'var(--primary)' }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state glass" style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {getIcon('FaBrain', 80, 'white', 'opacity-20')}
                            <h3 style={{ color: 'var(--text-dim)', marginTop: '1.5rem' }}>SELECT MRI BUNDLE FOR ANALYSIS</h3>
                        </div>
                    )}

                    <div className="terminal-log-container">
                        {logs.map((log, i) => (
                            <div key={i} className="log-line">
                                <span>{log.includes('[') ? log.split(']')[0] + ']' : ''}</span>
                                {log.includes(']') ? log.split(']')[1] : log}
                            </div>
                        ))}
                    </div>
                </main>

                <aside className="secondary-view">
                    <h3 className="sidebar-title" style={{ color: 'white', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        CLINICAL DATA FEED <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>SYNCED</span>
                    </h3>
                    <div className="sidebar-list">
                        {(filteredVideos || []).map(v => (
                            <div key={v._id} onClick={() => { setSelectedVideo(v); addLog(`[UI] Loading sequence NS-${v._id.slice(-4).toUpperCase()}`); }}
                                className={`sidebar-scan-card glass ${selectedVideo?._id === v._id ? 'active' : ''}`}>
                                <div className="scan-icon">{getIcon('FaHeartbeat', 18)}</div>
                                <div className="scan-info">
                                    <h4 style={{ color: 'white', margin: 0, fontSize: '0.85rem' }}>{v.title}</h4>
                                    <div className="scan-meta">
                                        <span className={`status-pill ${v.status}`}>{v.status}</span>
                                        <span style={{ color: 'var(--text-dim)' }}>ID: {v._id.slice(-4).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
