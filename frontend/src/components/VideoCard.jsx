import React from 'react';
import { FaBrain, FaTrash, FaCheckCircle, FaMicroscope, FaClock, FaSatelliteDish, FaFingerprint } from 'react-icons/fa';

const VideoCard = ({ video, onClick, onDelete }) => {
  const getStatusIcon = () => {
    switch (video.status) {
      case 'processed': return <FaCheckCircle className="status-processed" />;
      case 'flagged': return <FaMicroscope className="status-flagged" />;
      case 'processing': return <FaClock className="status-processing animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="premium-video-card glass" onClick={() => onClick(video)}>
      <div className="card-glimmer"></div>

      <div className="card-thumbnail-zone">
        <div className="scan-grid-overlay"></div>
        <FaBrain className="brain-icon" />
        <div className="security-tag">
          <FaFingerprint size={10} /> {video._id.slice(-6).toUpperCase()}
        </div>
      </div>

      <div className="card-body">
        <div className="title-row">
          <h3>{video.title}</h3>
          <button
            className="purge-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(video._id);
            }}
          >
            <FaTrash size={12} />
          </button>
        </div>

        <div className="meta-row">
          <div className="status-badge">
            {getStatusIcon()}
            <span>{video.status}</span>
          </div>
          <div className="date-badge">
            <FaSatelliteDish size={10} /> {new Date(video.createdAt).toLocaleDateString()}
          </div>
        </div>

        {video.status === 'processing' && (
          <div className="neural-progress">
            <div className="track">
              <div className="fill" style={{ width: `${video.progress}%` }}></div>
            </div>
            <span className="percent">{video.progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
