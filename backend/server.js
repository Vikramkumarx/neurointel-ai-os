require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now, strict in production
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Make io accessible globally or pass it to routes (future step: export io or use app.set)
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));