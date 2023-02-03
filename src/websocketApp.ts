import { WebSocketServer } from 'ws';
import Event from 'events';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Server } from 'http';
import { ExtSocket } from './types/Socket';

export const websocketEmitter = new Event();
export const WS_EVENTS = { newMessage: 'newMessage', fromServer: 'fromServer' };

export const createWebsocketServer = (server: Server, websocketEmitter: Event) => {
  const wss = new WebSocketServer({ server });

  websocketEmitter.on('fromServer', (message) => {
    wss.emit('fromServer', message);
  });

  wss.on('connection', (socket: ExtSocket, req) => {
    const token = req.url?.slice(1);

    if (token) {
      try {
        const payload = verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
        socket.username = payload.username;
      } catch (e) {
        socket.close();
      }
    }
  });

  wss.on('fromServer', (message) => {
    if (message.event === 'newMessage') {
      wss.clients.forEach((socket) => {
        const extSocket = socket as ExtSocket;

        if (extSocket.username === message.sender.username || extSocket?.username === message.reciever.username) {
          extSocket.send(
            JSON.stringify({
              event: 'newMessage',
              message: message.message,
              sender: message.sender,
              reciever: message.reciever,
            })
          );
        }
      });
    }
  });

  return wss;
};
