import { useState, useRef } from "react";
import api from "../api/axios";
import { FaCloudUploadAlt, FaTimes, FaPlus, FaTerminal, FaRobot, FaMicroscope } from "react-icons/fa";

const UploadModal = ({ onUploadSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [age, setAge] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [phase, setPhase] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("NO_DATA_STREAM: Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("age", age);
        formData.append("bloodType", bloodType);
        formData.append("phase", phase);

        setUploading(true);
        setError("");
        try {
            await api.post("/videos/upload", formData);
            setUploading(false);
            setIsOpen(false);
            onUploadSuccess();
            setFile(null);
            setTitle("");
            setDescription("");
            setAge("");
            setBloodType("");
            setPhase("");
        } catch (error) {
            setUploading(false);
            setError(error.response?.data?.message || "DECODER FAILURE: Data stream interrupted.");
        }
    };

    return (
        <div style={{ display: 'inline-block' }}>
            <button
                className="btn-upload-quantum"
                onClick={() => setIsOpen(true)}
            >
                <FaPlus /> INITIALIZE NEW SCAN
            </button>

            {isOpen && (
                <div className="modal-overlay-quantum" onClick={() => setIsOpen(false)}>
                    <div
                        className="modal-content-quantum glass pulse-border"
                        onClick={e => e.stopPropagation()}
                        style={{ background: '#020617', borderRadius: '24px', border: '1px solid var(--primary)', overflow: 'hidden', maxWidth: '700px' }}
                    >
                        <div className="modal-header-terminal" style={{ background: 'rgba(0, 242, 255, 0.05)', padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem', color: 'var(--primary)' }}>
                                        <FaTerminal /> UPLOAD_SEQUENCE
                                    </h2>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>
                                        ADDR: NEURO-STORAGE-PRIMARY
                                    </p>
                                </div>
                                <button
                                    className="close-btn-terminal"
                                    onClick={() => setIsOpen(false)}
                                    style={{ color: 'var(--text-dim)', transform: 'scale(1.2)' }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpload}>
                            <div className="terminal-body" style={{ padding: '2rem' }}>
                                {error && (
                                    <div className="terminal-error" style={{ marginBottom: '1.5rem' }}>
                                        [ERR]: {error}
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="command-line">
                                        <span className="prompt">SCAN_TITLE:</span>
                                        <input
                                            type="text"
                                            placeholder="Clinical Designation..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="command-line">
                                        <span className="prompt">PATIENT_AGE:</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. 45_YRS"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="command-line">
                                        <span className="prompt">BLOOD_TYPE:</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. O_POS"
                                            value={bloodType}
                                            onChange={(e) => setBloodType(e.target.value)}
                                        />
                                    </div>
                                    <div className="command-line">
                                        <span className="prompt">SCAN_PHASE:</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. POST_CONTRAST"
                                            value={phase}
                                            onChange={(e) => setPhase(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="command-line" style={{ marginBottom: '1.5rem' }}>
                                    <span className="prompt">STATUS_LOG:</span>
                                    <input
                                        type="text"
                                        placeholder="Brief metadata notes..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div className="file-zone-terminal" style={{ marginBottom: '2rem' }}>
                                    <label style={{ cursor: 'pointer' }}>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="drop-area" style={{ padding: '2.5rem' }}>
                                            <FaCloudUploadAlt size={35} color={file ? 'var(--success)' : 'var(--primary)'} />
                                            {file ? (
                                                <div style={{ marginTop: '1rem' }}>
                                                    <span style={{ color: 'var(--success)', display: 'block', fontWeight: 'bold' }}>{file.name}</span>
                                                    <span style={{ fontSize: '0.7rem' }}>READY_FOR_HANDSHAKE</span>
                                                </div>
                                            ) : (
                                                <p style={{ marginTop: '1rem', fontSize: '0.7rem' }}>DEPOSIT DATA STREAM HERE</p>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                <div className="system-checklist" style={{ marginBottom: '1.5rem' }}>
                                    <div className="item" style={{ fontSize: '0.6rem' }}><FaRobot /> SYST: OK</div>
                                    <div className="item" style={{ fontSize: '0.6rem' }}><FaMicroscope /> SENSOR: CALIB</div>
                                </div>

                                <button type="submit" className="terminal-submit" disabled={uploading}>
                                    {uploading ? "STREAMING DATA..." : "EXECUTE_UPLOAD"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadModal;
