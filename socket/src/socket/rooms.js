const registerRoomHandlers = (socket) => {
	socket.on('join-users', () => {
		socket.join(`users`)
	})

	socket.on('leave-users', () => {
		socket.leave(`users`)
	})

	socket.on('join-subjects', () => {
		socket.join(`subjects`)
	})

	socket.on('leave-subjects', () => {
		socket.leave(`subjects`)
	})

	socket.on('join-subject', (subjectId) => {
		socket.join(`subject-${subjectId}`)
	})

	socket.on('leave-subject', (subjectId) => {
		socket.leave(`subject-${subjectId}`)
	})

	socket.on('join-lesson', (lessonId) => {
		socket.join(`lesson-${lessonId}`)
	})

	socket.on('leave-lesson', (lessonId) => {
		socket.leave(`lesson-${lessonId}`)
	})

	socket.on('join-quiz', (quizId) => {
		socket.join(`quiz-${quizId}`)
	})

	socket.on('leave-quiz', (quizId) => {
		socket.leave(`quiz-${quizId}`)
	})
}

export default registerRoomHandlers
