import { useRef, useEffect } from "react";

const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [video?._id]);

    if (!video?._id) return <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>Select a video to play</div>;

    return (
        <div className="player-wrapper">
            <video
                ref={videoRef}
                controls
                className="main-video"
                poster="/placeholder_thumbnail.png"
                style={{ width: '100%', borderRadius: '12px' }}
            >
                <source
                    src={`http://127.0.0.1:5000/api/videos/${video._id}/stream`}
                    type="video/mp4"
                />
                <source
                    src={`http://127.0.0.1:5000/uploads/${video.filename}`}
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
