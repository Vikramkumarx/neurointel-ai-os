# Interview Q&A Cheat Sheet

## 🗣 General Questions

**Q: Why did you build this?**
**A:** I wanted to bridge the gap between high-end AI tech and medical usability. Doctors need clarity, not just raw data. This OS provides that "Pilot's Cockpit" view for diagnostics.

**Q: Is the AI real?**
**A:** The *interface* and *data flow* are real production-grade code. The diagnostic engine currently uses a simulation algorithm (Random Forest logic simulation) for demonstration, but the architecture allows plugging in a Python/TensorFlow model via an API endpoint in less than 2 hours.

## 💻 Technical Questions

**Q: Why MongoDB over SQL?**
**A:** Medical data (patient metadata) is highly variable. One patient might have 20 fields, another only 5. MongoDB's schema-less nature fits this "Document-based" storage perfectly compared to rigid SQL tables.

**Q: Why Socket.io instead of simple HTTP requests?**
**A:** Processing an MRI scan takes time. A simple HTTP request would timeout. WebSockets allow the server to "push" updates (Progress: 10%... 50%... Done), keeping the doctor engaged without freezing their browser.

**Q: How do you handle authentication?**
**A:** I use **JSON Web Tokens (JWT)**. When a user logs in, they get a signed token. This token is sent in the Header of every request. The server verifies the signature before allowing access to private patient data. This is stateless and scales better than Session Cookies.

**Q: How would you scale this to 10,000 users?**
**A:** 
1.  Move video storage to **AWS S3** (instead of local disk).
2.  Use **Redis** for caching session data.
3.  Deploy the AI Processing unit as a separate **Python Microservice**.
4.  Use **Kubernetes** to auto-scale the Node.js backend containers based on traffic.

## 🐛 Debugging Scenarios (If they ask "How would you fix X?")

**Q: Users report the site is slow.**
**A:** I would check the **Network Tab** first. Is the video loading too big? I'd implement **Lazy Loading** or **Adaptive Bitrate Streaming (HLS)** to deliver video in chunks.

**Q: Database connection fails intermittently.**
**A:** I would check the **Connection Pool** size in Mongoose. If we are opening too many connections, I'd limit the pool or implement a Singleton pattern for the database connection.
