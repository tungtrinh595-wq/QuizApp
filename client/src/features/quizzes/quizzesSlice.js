import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { extractError } from '@/utils'
import {
	getQuizzes,
	getQuizDetails,
	getQuizDetailsBySlug,
	createQuiz,
	editQuiz,
	deleteQuiz,
	startQuiz,
	assignQuestionToQuiz,
	removeQuestionFromQuiz,
	reorderQuizQuestions,
	addQuizQuestions,
} from './quizzesThunks'
import {
	handleAddQuiz,
	handleUpdateQuiz,
	handleRemoveQuiz,
	handleSetQuizzesList,
} from './quizzesHandlers'

const initialState = {
	list: null,
	quizMap: {
		// [quizId]: Quiz
	},
	isLoading: false,
	error: null,
	total: 0,
}

const quizzesSlice = createSlice({
	name: 'quizzes',
	initialState,
	reducers: {
		setQuizzesList(state, action) {
			handleSetQuizzesList(state, action)
		},
		addQuiz(state, action) {
			handleAddQuiz(state, action)
		},
		updateQuiz(state, action) {
			handleUpdateQuiz(state, action)
		},
		removeQuiz(state, action) {
			handleRemoveQuiz(state, action)
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getQuizzes.fulfilled, (state, action) => {
				handleSetQuizzesList(state, action)
			})
			.addCase(createQuiz.fulfilled, (state, action) => {
				handleAddQuiz(state, action)
			})
			.addCase(editQuiz.fulfilled, (state, action) => {
				handleUpdateQuiz(state, action)
			})
			.addCase(deleteQuiz.fulfilled, (state, action) => {
				handleRemoveQuiz(state, action)
			})
			.addCase(reorderQuizQuestions.fulfilled, (state, action) => {
				state.isLoading = false

				const { quizId, quizQuestions } = action.payload || {}
				if (!quizId || !Array.isArray(quizQuestions)) return
				const currentQuiz = state.quizMap[quizId]
				if (!currentQuiz) return
				state.quizMap[quizId] = {
					...currentQuiz,
					quizQuestions,
				}
			})
			.addCase(startQuiz.fulfilled, (state, action) => {
				state.isLoading = false
				const { quiz } = action.payload
				if (quiz?.id && state.quizMap[quiz.id]) {
					const { quizQuestions } = quiz
					if (Array.isArray(quizQuestions)) state.quizMap[quiz.id].quizQuestions = quizQuestions
				}
			})
			.addMatcher(
				(action) => action.type.startsWith('quizzes/') && action.type.endsWith('/pending'),
				(state) => {
					state.isLoading = true
					state.error = null
				}
			)
			.addMatcher(
				isAnyOf(
					getQuizDetails.fulfilled,
					getQuizDetailsBySlug.fulfilled,
					assignQuestionToQuiz.fulfilled,
					removeQuestionFromQuiz.fulfilled,
					addQuizQuestions.fulfilled
				),
				(state, action) => {
					state.isLoading = false

					const { quiz } = action.payload
					if (quiz?.id) {
						state.quizMap[quiz.id] = quiz
					}
				}
			)
			.addMatcher(
				(action) => action.type.startsWith('quizzes/') && action.type.endsWith('/rejected'),
				(state, action) => {
					state.isLoading = false
					state.error = extractError(action)
				}
			)
	},
})

export const { setQuizzesList, addQuiz, updateQuiz, removeQuiz } = quizzesSlice.actions
export default quizzesSlice.reducer
