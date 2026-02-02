# Technical Deep Dive & Architecture

## 🏗 System Architecture
The application follows a **Monolithic Containerized Architecture**:
1.  **Client (React)**: Handles the UI, connects via WebSockets, and streams video uploads.
2.  **Server (Express)**: Serves the API, manages WebSocket connections, and handles static file serving for the frontend bundle.
3.  **Database (MongoDB)**: Stores User identities and Video Metadata (paths, analysis scores, patient tags).
4.  **Storage (Local/Ephemeral)**: Videos remain on the active container storage (demonstrating temporary processing storage).

## 💡 Key Technical Implementations

### 1. Dual-Path Serving (Production vs. Dev)
*   **Challenge**: Getting React Router and Express API to work on the same port in production.
*   **Solution**: We implemented a "Catch-All" Regex Route in Express (`app.get(/(.*)/)`) that serves the `index.html` for any request not starting with `/api`. This allows the React SPA to handle client-side routing while Express handles the API.

### 2. Real-Time AI Simulation (Socket.io)
*   **Logic**: Instead of blocking the request while "processing" a video, we accept the upload and immediately trigger a background simulation.
*   **Flow**:
    1.  Upload -> Returns `200 OK`.
    2.  Server invokes `ffmpeg` (simulated).
    3.  `setInterval` calculates progress and emits `analysisProgress` events.
    4.  Frontend listens to these events to animate the progress bar and terminal logs.

### 3. Docker "Universal" Build
*   **Strategy**: We created a multi-stage-like Dockerfile that builds the Frontend first, then sets up the Backend, and finally serves everything using Node.
*   **Trick**: We explicitly handle `engine-strict=false` to avoid legacy package issues and use a clean directory structure to prevent `node_modules` conflicts during deployment.

### 4. MongoDB Reliability
*   **Issue**: Frequent timeouts on serverless deployments (Hugging Face).
*   **Fix**: Implemented a Robust Connection Logic with `serverSelectionTimeoutMS` and auto-retry mechanism. Added Regex-based whitelist routing to bypass strict Firewall rules.

## 👨‍💻 Code Highlight (For Whiteboard)
If asked to write a simple **Server-Side Rendering (SSR)** bypass or **Static Serving** logic:

```javascript
// Serving React from Express
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The "Magic" Route for SPAs
app.get(/(.*)/, (req, res, next) => {
    // Pass API requests through
    if (req.path.startsWith('/api')) return next();
    // Send everything else to React
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});
```
