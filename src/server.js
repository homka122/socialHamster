import mongoose from "mongoose";
import app from "./app.js";
import devSetup from "./devSetup.js";
import { WebSocketServer } from "ws";

const start = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(process.env.DB_URL)
  await mongoose.connection.dropDatabase();
  await devSetup();

  console.log("DB: OK")

  const PORT = process.env.PORT

  const server = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
  })

  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    ws.send('something')
    ws.on('message', data => {
      console.log(data.toString())
    })
  })
}

start()