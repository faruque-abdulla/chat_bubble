import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "node:path";

const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);
app.use(express.static("public"));

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("chat-message", (msg) => {
    io.emit("new_message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
