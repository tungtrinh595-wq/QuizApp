import { createAsyncThunk } from '@reduxjs/toolkit'

import { HTTP_STATUS, ROUTES, SOCKET_ROOM_TYPE } from '@/constants'
import { api } from '@/apis'
import { attachTokenToHeaders } from '@/utils'
import { updateSubject } from '@/features/subjects'
import { joinRoom } from '@/features/socket'

// Admin Quiz Thunks
export const getQuizzes = createAsyncThunk(
	'quizzes/getQuizzes',
	async (_, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get('/api/admin/quizzes', options)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getQuizDetails = createAsyncThunk(
	'quizzes/getQuizDetails',
	async ({ id }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/quizzes/${id}`, options)
			const { quiz } = response.data
			joinRoom(SOCKET_ROOM_TYPE.QUIZ, quiz.id)
			if (quiz.subject?.id) joinRoom(SOCKET_ROOM_TYPE.SUBJECT, quiz.subject.id)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const createQuiz = createAsyncThunk(
	'quizzes/createQuiz',
	async ({ formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post('/api/admin/quizzes', formData, options)
			const { quiz } = response.data
			const { subjects } = getState()
			const { id: subjectId } = quiz.subject ?? {}

			if (subjects.subjectMap?.[subjectId]) {
				const { subject, ...quizRes } = quiz
				const currentSubject = subjects.subjectMap[subjectId]
				const updatedSubject = {
					...currentSubject,
					quizzes: [...(currentSubject.quizzes || []), quizRes],
				}
				dispatch(updateSubject({ subject: updatedSubject }))
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const editQuiz = createAsyncThunk(
	'quizzes/editQuiz',
	async ({ id, formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/quizzes/${id}`, formData, options)
			const quiz = response.data.quiz
			const { subjects } = getState()
			const { id: subjectId } = quiz.subject ?? {}

			if (subjects.subjectMap?.[subjectId]) {
				const currentSubject = subjects.subjectMap[subjectId]
				if (Array.isArray(currentSubject.quizzes)) {
					const updatedQuizzes = currentSubject.quizzes.map((q) => (q.id === quiz.id ? quiz : q))
					const updatedSubject = {
						...currentSubject,
						quizzes: updatedQuizzes,
					}
					dispatch(updateSubject({ subject: updatedSubject }))
				}
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const deleteQuiz = createAsyncThunk(
	'quizzes/deleteQuiz',
	async ({ id }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(`/api/admin/quizzes/${id}`, options)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				const { subjects } = getState()

				const subjectEntry = Object.values(subjects.subjectMap || {}).find(
					(subject) => Array.isArray(subject.quizzes) && subject.quizzes.some((q) => q.id === id)
				)

				if (subjectEntry) {
					const updatedSubject = {
						...subjectEntry,
						quizzes: subjectEntry.quizzes.filter((q) => q.id !== id),
					}
					dispatch(updateSubject({ subject: updatedSubject }))
				}

				return { id }
			}

			return rejectWithValue({ message: 'Trạng thái phản hồi không mong đợi' })
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const assignQuestionToQuiz = createAsyncThunk(
	'quizzes/assignQuestionToQuiz',
	async ({ quizId, questionId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post(
				`/api/admin/quizzes/${quizId}/questions`,
				{ questionId },
				options
			)
			const { quizQuestion } = response.data
			const currentQuiz = getState().quizzes.quizMap?.[quizId]

			if (Array.isArray(currentQuiz?.quizQuestions)) {
				const updatedQuizQuestions = currentQuiz.quizQuestions.some(
					(q) => q.question.id === quizQuestion.question.id
				)
					? currentQuiz.quizQuestions.map((q) =>
							q.question.id === quizQuestion.question.id ? { ...q, ...quizQuestion } : q
					  )
					: [...currentQuiz.quizQuestions, quizQuestion]

				const updatedQuiz = {
					...currentQuiz,
					quizQuestions: updatedQuizQuestions,
				}

				return { quiz: updatedQuiz }
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const removeQuestionFromQuiz = createAsyncThunk(
	'quizzes/removeQuestionFromQuiz',
	async ({ quizId, questionId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(
				`/api/admin/quizzes/${quizId}/questions/${questionId}`,
				options
			)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				const currentQuiz = getState().quizzes.quizMap?.[quizId]

				if (Array.isArray(currentQuiz?.quizQuestions)) {
					const filteredQuestions = currentQuiz.quizQuestions.filter(
						(q) => q?.question?.id !== questionId
					)
					const updatedQuiz = {
						...currentQuiz,
						quizQuestions: filteredQuestions,
					}

					return { quiz: updatedQuiz }
				}

				return { quizId }
			}

			return rejectWithValue({ message: 'Trạng thái phản hồi không mong đợi' })
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const reorderQuizQuestions = createAsyncThunk(
	'quizzes/reorderQuizQuestions',
	async ({ orderList, quizId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/quizzes/questions/reorder`, { orderList }, options)
			const quizQuestionsRes = response.data.quizQuestions
			const { quizzes, subjects } = getState()
			const currentQuiz = quizzes.quizMap?.[quizId]

			const updatedQuizQuestions = currentQuiz?.quizQuestions
				? currentQuiz.quizQuestions.map((qq) => {
						const updated = quizQuestionsRes.find((qr) => qr.id === qq.id)
						return updated ? { ...qq, order: updated.order } : qq
				  })
				: quizQuestionsRes

			if (currentQuiz) {
				const updatedQuiz = {
					...currentQuiz,
					quizQuestions: updatedQuizQuestions,
				}

				return {
					quizId,
					quizQuestions: updatedQuizQuestions,
					quiz: updatedQuiz,
				}
			}

			return { quizQuestions: quizQuestionsRes }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const addQuizQuestions = createAsyncThunk(
	'quizzes/addQuizQuestions',
	async ({ subjectId, quizId, payload }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post(`/api/admin/quizzes/${quizId}/questions/bulk`, payload, options)
			const { quizQuestions } = response.data

			const subject = getState().subjects.subjectMap?.[subjectId]
			if (subject && quizQuestions) {
				const questions = quizQuestions.map((q) => q.question)
				dispatch(
					updateSubject({
						subject: {
							...subject,
							questions: [...questions, ...(subject.questions || [])],
						},
					})
				)
			}

			const currentQuiz = getState().quizzes.quizMap?.[quizId]
			if (Array.isArray(currentQuiz?.quizQuestions)) {
				let updatedQuizQuestions = [...currentQuiz.quizQuestions]

				for (const newQuestion of quizQuestions) {
					const existsIndex = updatedQuizQuestions.findIndex(
						(q) => q.question.id === newQuestion.question.id
					)

					if (existsIndex !== -1) {
						updatedQuizQuestions[existsIndex] = {
							...updatedQuizQuestions[existsIndex],
							...newQuestion,
						}
					} else {
						updatedQuizQuestions.push(newQuestion)
					}
				}

				const updatedQuiz = {
					...currentQuiz,
					quizQuestions: updatedQuizQuestions,
				}

				return { quiz: updatedQuiz }
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

// User Thunks
export const getQuizDetailsBySlug = createAsyncThunk(
	'quizzes/getQuizDetailsBySlug',
	async ({ slug }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/quizzes/slug/${slug}`, options)
			const { quiz } = response.data
			joinRoom(SOCKET_ROOM_TYPE.QUIZ, quiz.id)
			if (quiz.subject?.id) joinRoom(SOCKET_ROOM_TYPE.SUBJECT, quiz.subject.id)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const startQuiz = createAsyncThunk(
	'quizzes/startQuiz',
	async ({ quizId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/quizzes/public/${quizId}`, options)
			const { isPublished, message, quiz } = response.data

			if (!isPublished) {
				throw new Error(message || 'Bài thi chưa được công bố')
			}

			const { auth, quizzes } = getState()

			const quizData = quiz || quizzes.quizMap?.[quizId]
			if (!quizData) throw new Error('Không thể bắt đầu do không tìm thấy bài thi')

			const subjectId = quizData.subject?.id
			if (!subjectId) throw new Error('Quiz không có subject hợp lệ')

			const payload = {
				userId: auth.me?.id,
				subjectId,
				quizId,
				quizRoute: ROUTES.QUIZ_DETAILS.replace(':slug', quizData.slug),
				startedAt: Date.now(),
			}
			localStorage.setItem('doingQuiz', JSON.stringify(payload))
			return { quiz: quizData, started: payload }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)
