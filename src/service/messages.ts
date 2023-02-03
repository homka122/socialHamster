import ConversationRepository, { IConversation } from '../models/conversation';
import { IUser } from '../models/user';

export const getConversation = async (user1: IUser, user2: IUser) => {
  let conversation;

  const conversationCandidate = await ConversationRepository.findOne({
    $or: [
      { user1, user2 },
      { user1: user2, user2: user1 },
    ],
  });

  if (!conversationCandidate) {
    conversation = await ConversationRepository.create({ user1, user2 });
  } else {
    conversation = conversationCandidate;
  }

  return conversation;
};
