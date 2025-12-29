import { io } from 'socket.io-client'

import { SOCKET_RECONNECT_ATTEMPTS, SOCKET_RECONNECT_DELAY } from '@/constants'

let socket = null

export const connectSocket = async (token) => {
	socket = io(import.meta.env.VITE_SOCKET_URL, {
		auth: { token },
		autoConnect: true,
		reconnection: true,
		reconnectionAttempts: SOCKET_RECONNECT_ATTEMPTS,
		reconnectionDelay: SOCKET_RECONNECT_DELAY,
	})
}

export const getSocket = () => socket

export const disconnectSocket = () => {
	if (socket) socket.disconnect()
}

export const joinRoom = (type, id) => {
	if (socket && id) socket.emit(`join-${type}`, id)
}

export const leaveRoom = (type, id) => {
	if (socket && id) socket.emit(`leave-${type}`, id)
}
