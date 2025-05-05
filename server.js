// server.js main entry file
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "node:path";
import { Message } from "./models/Message.js";

const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);
app.use(express.static("public"));

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 }).limit(4);
  res.json(messages);
});

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("user_joined", (data) => {
    io.emit("user_joined_notification", data);
    io.emit("user_count", io.engine.clientsCount);
  });

  socket.on("chat-message", async (msg) => {
    const saved = await Message.create(msg);
    io.emit("new_message", saved);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error", err));
});
