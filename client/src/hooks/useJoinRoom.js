import { useEffect } from 'react'

import { getSocket } from '@/features'

export const useJoinRoom = (type, id) => {
	useEffect(() => {
		const socket = getSocket()
		if (socket && id) {
			socket.emit(`join-${type}`, id)
			return () => socket.emit(`leave-${type}`, id)
		}
	}, [type, id])
}
