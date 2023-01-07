import express from 'express'
import authRouter from './router/auth.js'
import conversationsRouter from './router/conversations.js'
import messagesRouter from './router/messages.js'
import usersRouter from './router/users.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/users', usersRouter)

export default app