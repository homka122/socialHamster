import mongoose, { mongo, Schema } from 'mongoose';
import ConversationRepository from './conversation';

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  conversation: mongoose.Types.ObjectId;
}

const messageSchema = new mongoose.Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
});

messageSchema.pre('save', async function (next) {
  await ConversationRepository.findByIdAndUpdate(this.conversation._id, { lastMessage: this._id });
  next();
});

const MessageRepository = mongoose.model<IMessage>('Message', messageSchema);

export default MessageRepository;
