import { createAsyncThunk } from '@reduxjs/toolkit'

import { HTTP_STATUS, SOCKET_ROOM_TYPE } from '@/constants'
import { api } from '@/apis'
import { attachTokenToHeaders } from '@/utils'
import { updateSubject } from '@/features/subjects'
import { updateQuiz } from '@/features/quizzes'
import { joinRoom } from '@/features/socket'

// Admin Subject Thunks
export const getSubjectDetails = createAsyncThunk(
	'subjects/getSubjectDetails',
	async ({ id }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/subjects/${id}`, options)
			const { subject } = response.data
			joinRoom(SOCKET_ROOM_TYPE.SUBJECT, subject.id)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const createSubject = createAsyncThunk(
	'subjects/createSubject',
	async ({ formData }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post('/api/admin/subjects', formData, options)

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const editSubject = createAsyncThunk(
	'subjects/editSubject',
	async ({ id, formData }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/subjects/${id}`, formData, options)

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const deleteSubject = createAsyncThunk(
	'subjects/deleteSubject',
	async ({ id }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(`/api/admin/subjects/${id}`, options)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				return { id }
			}

			return rejectWithValue({ message: 'Trạng thái phản hồi không mong đợi' })
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

// Admin Subject Questions Thunks
export const getSubjectQuestions = createAsyncThunk(
	'subjects/getSubjectQuestions',
	async ({ subjectId }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/questions/subject/${subjectId}`, options)
			const questions = response.data.questions
			const subject = getState().subjects.subjectMap?.[subjectId]

			if (subject && Array.isArray(questions)) {
				dispatch(
					updateSubject({
						subject: {
							...subject,
							questions,
						},
					})
				)
			}
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const addSubjectQuestion = createAsyncThunk(
	'subjects/addSubjectQuestion',
	async ({ subjectId, formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post(`/api/admin/questions`, formData, options)
			const { question } = response.data
			const subject = getState().subjects.subjectMap?.[subjectId]

			if (subject && question) {
				dispatch(
					updateSubject({
						subject: {
							...subject,
							questions: [question, ...(subject.questions || [])],
						},
					})
				)
			}
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const editSubjectQuestion = createAsyncThunk(
	'subjects/editSubjectQuestion',
	async ({ id, formData, subjectId = '', quizId }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/questions/${id}`, formData, options)
			const { question } = response.data
			const { subjects, quizzes } = getState()

			if (question && subjectId) {
				const oldSubject = subjects.subjectMap?.[subjectId]
				const newSubjectId =
					typeof question.subject === 'string' ? question.subject : question.subject?.id
				const newSubject = subjects.subjectMap?.[newSubjectId]

				if (oldSubject && oldSubject.id !== newSubjectId && Array.isArray(oldSubject.questions)) {
					dispatch(
						updateSubject({
							subject: {
								...oldSubject,
								questions: oldSubject.questions.filter((q) => q.id !== id),
							},
						})
					)
				}

				if (newSubject && Array.isArray(newSubject.questions)) {
					const hasItem = newSubject.questions.some((q) => q.id === question.id)
					const updatedQuestions = hasItem
						? newSubject.questions.map((q) => (q.id === question.id ? { ...q, ...question } : q))
						: [question, ...newSubject.questions]
					dispatch(
						updateSubject({
							subject: {
								...newSubject,
								questions: updatedQuestions,
							},
						})
					)
				}
			}

			const currentQuiz = quizzes.quizMap?.[quizId]
			if (currentQuiz?.quizQuestions && Array.isArray(currentQuiz.quizQuestions)) {
				const hasChanged = currentQuiz.quizQuestions.some((q) => q.question.id === question.id)

				if (hasChanged) {
					const updatedQuizQuestions = currentQuiz.quizQuestions.map((q) =>
						q.question.id === question.id ? { ...q, question: { ...q.question, ...question } } : q
					)
					dispatch(
						updateQuiz({
							quiz: {
								...currentQuiz,
								quizQuestions: updatedQuizQuestions,
							},
						})
					)
				}
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const deleteSubjectQuestion = createAsyncThunk(
	'subjects/deleteSubjectQuestion',
	async ({ id, subjectId }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(`/api/admin/questions/${id}`, options)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				const subject = getState().subjects.subjectMap?.[subjectId]
				if (subject && Array.isArray(subject.questions)) {
					dispatch(
						updateSubject({
							subject: {
								...subject,
								questions: subject.questions.filter((q) => q.id !== id),
							},
						})
					)
				}
				return { id }
			}
			return rejectWithValue({ message: 'Trạng thái phản hồi không mong đợi' })
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

// User Thunks
export const getSubjects = createAsyncThunk(
	'subjects/getSubjects',
	async (_, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get('/api/subjects', options)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getSubjectDetailsBySlug = createAsyncThunk(
	'subjects/getSubjectDetailsBySlug',
	async ({ slug }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/subjects/slug/${slug}`, options)
			const { subject } = response.data
			joinRoom(SOCKET_ROOM_TYPE.SUBJECT, subject.id)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)
