import mongoose from "mongoose";
import app from "./app.js";

const start = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(process.env.DB_URL)
  await mongoose.connection.dropDatabase();
  console.log("DB: OK")

  const PORT = process.env.PORT

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
  })
}

start()