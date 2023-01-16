import express from 'express'
import authRouter from './router/auth.js'
import conversationsRouter from './router/conversations.js'
import messagesRouter from './router/messages.js'
import usersRouter from './router/users.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorMiddleware } from './middleware/errorMiddleware.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'https://socialhamster.homka122.ru', credentials: true }))

app.use('/api/auth', authRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/users', usersRouter)

app.use(errorMiddleware)

export default app