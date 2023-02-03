import mongoose, { Schema } from 'mongoose';

export interface IToken {
  _id: mongoose.Types.ObjectId;
  token: string;
  user: mongoose.Types.ObjectId;
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const TokenRepository = mongoose.model<IToken>('Token', tokenSchema);

export default TokenRepository;
