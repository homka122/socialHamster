import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  conversation: {
    type: mongoose.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
})

const MessageRepository = mongoose.model('Message', messageSchema)

export default MessageRepository