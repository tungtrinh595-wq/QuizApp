export const handleAddQuiz = (state, action) => {
	state.isLoading = false

	const { quiz } = action.payload
	if (!quiz?.id) return
	state.quizMap[quiz.id] = quiz
	if (Array.isArray(state.list)) {
		const exists = state.list.some((l) => l.id === quiz.id)
		if (!exists) {
			state.list = [quiz, ...state.list]
			state.total += 1
		}
	}
}

export const handleUpdateQuiz = (state, action) => {
	state.isLoading = false

	const { quiz } = action.payload
	if (!quiz?.id) return
	state.quizMap[quiz.id] = quiz
	if (Array.isArray(state.list)) state.list = state.list.map((s) => (s.id === quiz.id ? quiz : s))
}

export const handleRemoveQuiz = (state, action) => {
	state.isLoading = false

	const { id: quizId } = action.payload
	if (!quizId) return
	delete state.quizMap[quizId]
	if (Array.isArray(state.list)) state.list = state.list.filter((s) => s.id !== quizId)
	state.total = Math.max(0, state.total - 1)
}

export const handleSetQuizzesList = (state, action) => {
	state.isLoading = false

	const { quizzes, total } = action.payload || {}
	if (Array.isArray(quizzes)) state.list = quizzes
	if (typeof total === 'number') state.total = total
}
