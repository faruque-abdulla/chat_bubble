// models/Message.js
import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  text: String,
  username: String,
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);
