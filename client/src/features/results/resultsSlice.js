import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { LIMIT_QUERY_DEFAULT } from '@/constants'
import { extractError } from '@/utils'
import {
	getQuizResults,
	getAllQuizResults,
	getQuizResult,
	getResultDetails,
	submitQuiz,
	getUserResults,
	getMyResults,
} from './resultsThunks'

const initialState = {
	quizResultMap: {
		// [quizId]: {
		// 	result: Result,
		// 	isLoading: false,
		// 	error: null,
		// }
	},
	quizResultsMap: {
		// [quizId]: {
		// 	list: [Results],
		// 	isLoading: false,
		// 	error: null,
		// 	query: {
		// 		page: 1,
		// 		limit: LIMIT_QUERY_DEFAULT,
		// 	},
		// 	total: 0,
		// 	totalPages: 0,
		// 	prevQuery: {},
		// },
	},
	userResultsMap: {
		// [userId]: {
		// 	list: [Results],
		// 	isLoading: false,
		// 	error: null,
		// 	query: {
		// 		page: 1,
		// 		limit: LIMIT_QUERY_DEFAULT,
		// 	},
		// 	total: 0,
		// 	totalPages: 0,
		// 	prevQuery: {},
		// },
	},
	resultMap: {
		// [id]: Result
	},
	isLoading: false,
	error: null,
}

const quizResultsSlice = createSlice({
	name: 'quizResults',
	initialState,
	reducers: {
		setResultsQuery(state, action) {
			const { quizId, query } = action.payload
			if (!quizId || !query) return
			state.quizResultsMap[quizId] = {
				...(state.quizResultsMap[quizId] || {}),
				query,
			}
		},
		setResultsPrevQuery(state, action) {
			const { quizId, query } = action.payload
			if (!quizId || !query) return
			state.quizResultsMap[quizId] = {
				...(state.quizResultsMap[quizId] || {}),
				prevQuery: query,
			}
		},
		restartQuiz(state, action) {
			state.error = null
			const { quizId } = action.payload
			if (!quizId) return
			const { [quizId]: _, ...rest } = state.quizResultMap
			state.quizResultMap = rest
		},
		updateResult(state, action) {
			state.isLoading = false
			const { result, quiz, emitter } = action.payload

			if (!result?.id) return
			state.resultMap[result.id] = {
				...(state.resultMap[result.id] || {}),
				...result,
			}

			const initResultMap = () => ({
				list: [],
				isLoading: false,
				error: null,
				query: {
					page: 1,
					limit: LIMIT_QUERY_DEFAULT,
				},
				total: 0,
				totalPages: 0,
				prevQuery: {},
			})

			// --- Quiz Results ---
			if (quiz?.id) {
				if (!state.quizResultsMap[quiz.id]) state.quizResultsMap[quiz.id] = initResultMap()

				const quizResults = state.quizResultsMap[quiz.id]
				state.quizResultsMap[quiz.id].list = [
					{ ...result, quiz },
					...quizResults.list.filter((q) => q.id !== result.id),
				]
			}

			// --- User Results ---
			if (emitter?.id) {
				const userId = emitter.id
				if (!state.userResultsMap[userId]) state.userResultsMap[userId] = initResultMap()

				const userResults = state.userResultsMap[userId]
				state.userResultsMap[userId].list = [
					{ ...result, quiz },
					...userResults.list.filter((q) => q.id !== result.id),
				]
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getResultDetails.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getQuizResults.fulfilled, (state, action) => {
				const { quizId, results, page, limit, total, totalPages } = action.payload
				state.quizResultsMap[quizId] = {
					...(state.quizResultsMap[quizId] || {}),
					list: results,
					query: {
						...(state.quizResultsMap[quizId]?.query || {}),
						...(page ? { page } : {}),
						...(limit ? { limit } : {}),
					},
					total,
					totalPages,
					isLoading: false,
					error: null,
				}
			})
			.addCase(getAllQuizResults.fulfilled, (state, action) => {
				const { quizId, results, total } = action.payload
				state.quizResultsMap[quizId] = {
					...(state.quizResultsMap[quizId] || {}),
					list: results,
					total,
					isLoading: false,
					error: null,
				}
			})
			.addCase(getResultDetails.fulfilled, (state, action) => {
				const { result } = action.payload
				if (result?.id) {
					state.resultMap[result.id] = {
						...(state.resultMap[result.id] || {}),
						...result,
					}
				}
				state.isLoading = false
			})
			.addCase(getQuizResults.rejected, (state, action) => {
				const { quizId, error } = action.payload
				if (quizId) {
					state.quizResultsMap[quizId] = {
						...(state.quizResultsMap[quizId] || {}),
						isLoading: false,
						error,
					}
				}
			})
			.addCase(getResultDetails.rejected, (state, action) => {
				state.isLoading = false
				state.error = extractError(action)
			})
			.addMatcher(isAnyOf(getQuizResults.pending, getAllQuizResults.pending), (state, action) => {
				const quizId = action.meta.arg.quizId
				const prev = state.quizResultsMap[quizId] || {}
				state.quizResultsMap[quizId] = {
					...prev,
					isLoading: true,
				}
			})
			.addMatcher(isAnyOf(getUserResults.pending, getMyResults.pending), (state, action) => {
				let userId = action.meta.arg?.userId
				if (!userId) return

				const prev = state.userResultsMap[userId] || {}
				state.userResultsMap[userId] = {
					...prev,
					isLoading: true,
				}
			})
			.addMatcher(isAnyOf(getQuizResult.pending, submitQuiz.pending), (state, action) => {
				const quizId = action.meta.arg.quizId
				state.quizResultMap[quizId] = {
					...(state.quizResultMap[quizId] || {}),
					isLoading: true,
				}
			})
			.addMatcher(isAnyOf(getQuizResult.fulfilled, submitQuiz.fulfilled), (state, action) => {
				const { quizId, result } = action.payload
				state.quizResultMap[quizId] = {
					...(state.quizResultMap[quizId] || {}),
					result,
					isLoading: false,
					error: null,
				}
			})
			.addMatcher(isAnyOf(getUserResults.fulfilled, getMyResults.fulfilled), (state, action) => {
				const { results, total } = action.payload
				let userId = action.payload.userId
				if (!userId) return

				state.userResultsMap[userId] = {
					...(state.userResultsMap[userId] || {}),
					list: results,
					total,
					isLoading: false,
					error: null,
				}
			})
			.addMatcher(isAnyOf(getQuizResult.rejected, submitQuiz.rejected), (state, action) => {
				const error = extractError(action)
				const quizId = action.payload.quizId
				if (!quizId) return

				state.quizResultMap[quizId] = {
					...(state.quizResultMap[quizId] || {}),
					isLoading: false,
					error,
				}
			})
			.addMatcher(isAnyOf(getUserResults.rejected, getMyResults.rejected), (state, action) => {
				const error = extractError(action)
				let userId = action.meta.arg.userId
				if (!userId) return

				state.userResultsMap[userId] = {
					...(state.userResultsMap[userId] || {}),
					isLoading: false,
					error,
				}
			})
	},
})

export const { setResultsQuery, setResultsPrevQuery, restartQuiz, updateResult } =
	quizResultsSlice.actions
export default quizResultsSlice.reducer
