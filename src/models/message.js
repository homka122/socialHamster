import mongoose, { mongo } from "mongoose";
import ConversationRepository from "./conversation.js";

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

messageSchema.pre('save', async function (next) {
  await ConversationRepository.findByIdAndUpdate(this.conversation._id, { lastMessage: this._id })
  next()
})

const MessageRepository = mongoose.model('Message', messageSchema)

export default MessageRepository