import mongoose, { mongo, Schema } from 'mongoose';

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
  lastMessage: mongoose.Types.ObjectId;
}

const conversationSchema = new mongoose.Schema<IConversation>({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
});

const ConversationRepository = mongoose.model<IConversation>('Conversation', conversationSchema);

export default ConversationRepository;
