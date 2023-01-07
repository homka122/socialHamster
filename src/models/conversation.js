import mongoose, { mongo } from "mongoose";

const conversationSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  }
})

const ConversationRepository = mongoose.model('Conversation', conversationSchema)

export default ConversationRepository