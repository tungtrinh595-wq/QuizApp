import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'

import { initSocket } from './socket/index.js'
import { errorHandler } from './socket/middleware.js'
import routes from './routes/index.js'
import { HTTP_STATUS } from './constants/index.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.status(HTTP_STATUS.OK).send('OK'))

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_BASE_URL,
		methods: ['GET', 'POST'],
	},
})

initSocket(io)

app.use(express.json())

app.set('io', io)
app.use('/', routes)

app.use(errorHandler)

const PORT = process.env.PORT
server.listen(PORT, () => {
	console.log(`Socket server running on port ${PORT}`)
})
