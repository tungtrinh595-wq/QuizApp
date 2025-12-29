import registerRoomHandlers from './rooms.js'

import { verifySocket } from './middleware.js'
import { ROLE } from '../constants/index.js'

export const initSocket = (io) => {
	io.use(verifySocket)

	io.on('connection', (socket) => {
		const { me } = socket.data

		if (!me?.email || !me?.role) {
			console.log(`⚠️ Unknown socket connected: ${socket.id}`)
			return socket.disconnect()
		}

		console.log(`🔌 ${me.role} connected: ${me.email} (${socket.id})`)

		if (me.role === ROLE.ADMIN) {
			socket.join('subjects')
			socket.join('users')
		} else if (me.role === ROLE.USER) {
			socket.join('subjects')
		}

		socket.on('disconnect', () => {
			if (!me?.email || !me?.role) console.log(`📴 Unknown socket disconnected (${socket.id})`)
			else console.log(`📴 ${me.role} disconnected: ${me.email} (${socket.id})`)
		})

		registerRoomHandlers(socket, io)
	})
}
