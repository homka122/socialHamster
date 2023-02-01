import { WebSocketServer } from "ws";
import Event from "events";
import { verify } from "jsonwebtoken";

export const websocketEmitter = new Event();

export const createWebsocketServer = (server, websocketEmitter) => {
  const wss = new WebSocketServer({ server })
  websocketEmitter.on('fromServer', (message) => {
    wss.emit('fromServer', message)
  })

  wss.on('connection', (ws, req) => {
    const token = req.url.slice(1);

    if (token) {
      try {
        const payload = verify(token, process.env.JWT_ACCESS_SECRET);
        ws.username = payload.username
      } catch (e) {
        ws.close();
      }
    }
  })

  wss.on('fromServer', message => {
    if (message.event === 'sendMessage') {
      wss.clients.forEach(client => {
        if (client?.username === message.sender.username || client?.username === message.reciever.username) {
          client.send(JSON.stringify({ event: 'newMessage', message: message.message, sender: message.sender, reciever: message.reciever }))
        }
      })
    }
  })

  return wss
}



