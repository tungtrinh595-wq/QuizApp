export const emitToRoom = (req, room, event) => {
	const io = req.app.get('io')
	io.to(room).emit(event, req.body)
}
