import express from 'express';
import authRouter from './router/auth.js';
import likesRouter from './router/likes.js';
import conversationsRouter from './router/conversations.js';
import messagesRouter from './router/messages.js';
import usersRouter from './router/users.js';
import postsRouter from './router/posts.js';
import cookieParser from 'cookie-parser';
import friendshipRouter from './router/friendship.js';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import morgan from 'morgan';

let origin = 'https://socialhamster.homka122.ru';
if (process.env.NODE_ENV) origin = 'http://localhost:3000';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin, credentials: true }));

if (process.env.NODE_ENV) app.use('/api/static', express.static('src/public'));

app.use('/api/auth', authRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/friendship', friendshipRouter);
app.use('/api/likes', likesRouter);

app.use(errorMiddleware);

export default app;
