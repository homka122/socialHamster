import { WebSocketServer } from "ws";
import Event from "events";

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

    ws.on('message', message => {
      const data = JSON.parse(message)

      if (data.event === 'sendMessage') {
        wss.clients.forEach(client => {
          console.log(data.userThatGet, '1')
          if (client?.username === data.sender.username || client?.username === data.userThatGet.username) {
            client.send(JSON.stringify({ event: 'newMessage', message: data.message }))
          }
        })
      }
    })
  })

  wss.on('fromServer', message => {
    console.log(message)
  })

  return wss
}



