import mongoose from 'mongoose';
import app from './app';
import { createWebsocketServer, websocketEmitter } from './websocketApp';

const start = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.DB_URL!);

  console.log('DB: OK');

  const PORT = Number(process.env.PORT);

  const server = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });

  createWebsocketServer(server, websocketEmitter);
};

start();
