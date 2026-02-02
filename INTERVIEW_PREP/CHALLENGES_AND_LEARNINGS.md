# Challenges faced & Solutions (STAR Method)

Use these stories when the interviewer asks: "Tell me about a time you faced a tough technical challenge."

## 1. The "100MB Upload" & Docker Storage Limit
*   **Situation**: During deployment to Hugging Face, large video uploads (>50MB) were crashing the server or timing out.
*   **Task**: Allow 100MB+ MRI scans to be uploaded reliably.
*   **Action**: 
    1.  Configured `Multer` buffers to handle streams instead of loading files into RAM.
    2.  Increased `body-parser` and Nginx-level limits (via Express middleware limits).
    3.  Optimized the Docker container to clean up temp files immediately after processing.
*   **Result**: Successful upload of high-res MRI scans without memory leaks.

## 2. The "Express 5.0 Wildcard" Bug
*   **Situation**: After upgrading dependencies, the production build failed with `PathError: Missing parameter name at index 1`. The app wouldn't load any pages.
*   **Task**: Identify why the standard catch-all route `app.get('*')` was failing.
*   **Action**: 
    1.  Debugged logs and found it was a breaking change in `path-to-regexp` (used by newer Express).
    2.  Researched standards and found that `*` is no longer a valid unnamed wildcard.
    3.  Refactored the routing logic to use Regex `app.get(/(.*)/)` which is version-agnostic.
*   **Result**: The application became future-proof and compatible with both Express 4 and 5.

## 3. The "MongoDB Whitelist" Nightmare
*   **Situation**: The application verified perfectly locally but refused to connect to the Database in the Cloud environment, throwing buffer timeouts.
*   **Task**: Securely connect the Serverless Container to MongoDB Atlas.
*   **Action**: 
    1.  Diagnosed that the container's IP was dynamic and changing on every restart, making static whitelisting impossible.
    2.  Configured MongoDB Network Access to allow `0.0.0.0/0` (Anywhere) but secured it with strong high-entropy passwords.
    3.  Implemented a connection retry logic in the backend to handle "Cold Start" delays.
*   **Result**: 99.9% Uptime on database connectivity during demos.

## 4. The "Missing Frontend" in Docker
*   **Situation**: The build passed, but the screen was blank. The server couldn't find `index.html`.
*   **Task**: Serve the frontend correctly from a unified backend container.
*   **Action**: 
    1.  Restructured the Dockerfile to build `vite` explicitly inside the container.
    2.  Used `path.resolve` with `__dirname` to dynamically locate the `dist` folder regardless of where the node process was started.
*   **Result**: A self-contained "One-Click Deploy" artifact.
