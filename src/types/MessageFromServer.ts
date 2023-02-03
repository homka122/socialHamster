import { IUser } from '../models/user';

type SendMessageEvent = {
  event: 'sendMessage';
  sender: IUser;
  reciever: IUser;
  message: string;
};
