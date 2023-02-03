declare namespace Express {
  export interface Request {
    user: import('mongoose').Document<unknown, any, import('./models/user').IUser> &
      import('./models/user').IUser &
      Required<{ _id: import('mongoose').Types.ObjectId }>;
  }
}
