import { createAsyncThunk } from '@reduxjs/toolkit'

import { HTTP_STATUS, SOCKET_ROOM_TYPE } from '@/constants'
import { api } from '@/apis'
import { attachTokenToHeaders } from '@/utils'
import { updateSubject } from '@/features/subjects'
import { joinRoom } from '@/features/socket'

// Admin Thunks
export const getLessons = createAsyncThunk(
	'lessons/getLessons',
	async (_, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get('/api/admin/lessons', options)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getLessonDetails = createAsyncThunk(
	'lessons/getLessonDetails',
	async ({ id }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/lessons/${id}`, options)
			const { lesson } = response.data
			joinRoom(SOCKET_ROOM_TYPE.LESSON, lesson.id)
			if (lesson.subject?.id) joinRoom(SOCKET_ROOM_TYPE.SUBJECT, lesson.subject.id)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const createLesson = createAsyncThunk(
	'lessons/createLesson',
	async ({ formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post('/api/admin/lessons', formData, options)
			const lesson = response.data.lesson
			const { id: subjectId } = lesson.subject
			const { subjects } = getState()

			if (subjects.subjectMap?.[subjectId]) {
				const { subject, ...lessonRes } = lesson
				const currentSubject = subjects.subjectMap[subjectId]
				const updatedSubject = {
					...currentSubject,
					lessons: [...(currentSubject.lessons || []), lessonRes],
				}
				dispatch(updateSubject({ subject: updatedSubject }))
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const editLesson = createAsyncThunk(
	'lessons/editLesson',
	async ({ id, formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/lessons/${id}`, formData, options)
			const { lesson } = response.data
			const { subjects } = getState()
			const subjectId = lesson.subject?.id

			const currentSubject = subjectId ? subjects.subjectMap?.[subjectId] : null
			if (currentSubject && Array.isArray(currentSubject.lessons)) {
				const updatedLessons = currentSubject.lessons.map((l) => (l.id === lesson.id ? lesson : l))
				const updatedSubject = { ...currentSubject, lessons: updatedLessons }
				dispatch(updateSubject({ subject: updatedSubject }))
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const deleteLesson = createAsyncThunk(
	'lessons/deleteLesson',
	async ({ id }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(`/api/admin/lessons/${id}`, options)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				const { subjects } = getState()
				const subjectEntry = Object.values(subjects.subjectMap || {}).find(
					(subj) => Array.isArray(subj.lessons) && subj.lessons.some((l) => l.id === id)
				)

				if (subjectEntry) {
					const updatedSubject = {
						...subjectEntry,
						lessons: subjectEntry.lessons.filter((l) => l.id !== id),
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

export const attachLessonFiles = createAsyncThunk(
	'lessons/attachLessonFiles',
	async ({ lessonId, formData }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post(`/api/admin/lessons/${lessonId}/files`, formData, options)
			const { uploadedFiles } = response.data
			const lesson = getState().lessons.lessonMap?.[lessonId]

			if (lesson) {
				const updatedLesson = {
					...lesson,
					lessonFiles: [...(lesson.lessonFiles || []), ...uploadedFiles],
				}
				return { lesson: updatedLesson }
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const deleteLessonFile = createAsyncThunk(
	'lessons/deleteLessonFile',
	async ({ id, lessonId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(`/api/admin/lessons/files/${id}`, options)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				const lesson = getState().lessons.lessonMap?.[lessonId]
				if (lesson?.lessonFiles) {
					const updatedLesson = {
						...lesson,
						lessonFiles: lesson.lessonFiles.filter((file) => file.id !== id),
					}
					return { lesson: updatedLesson }
				}
				return { lessonId }
			}

			return rejectWithValue({ message: 'Trạng thái phản hồi không mong đợi' })
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const reorderLessons = createAsyncThunk(
	'lessons/reorderLessons',
	async ({ orderList }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/lessons/reorder`, { orderList }, options)
			const lessonsRes = response.data.lessons
			const { subjects, lessons } = getState()

			const updatedLessonList = lessons.list
				? lessons.list.map((lesson) => {
						const updated = lessonsRes.find((l) => l.id === lesson.id)
						return updated ? { ...lesson, order: updated.order } : lesson
				  })
				: lessonsRes

			Object.values(subjects.subjectMap || {}).forEach((subject) => {
				if (Array.isArray(subject.lessons)) {
					const updatedSubjectLessons = subject.lessons.map((lesson) => {
						const updated = lessonsRes.find((l) => l.id === lesson.id)
						return updated && typeof updated.order === 'number'
							? { ...lesson, order: updated.order }
							: lesson
					})

					const updatedSubject = {
						...subject,
						lessons: updatedSubjectLessons,
					}

					dispatch(updateSubject({ subject: updatedSubject }))
				}
			})

			return { lessons: updatedLessonList }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

// User Thunks
export const getPublicLessons = createAsyncThunk(
	'lessons/getPublicLessons',
	async (_, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get('/api/lessons', options)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getPublicLessonDetails = createAsyncThunk(
	'lessons/getPublicLessonDetails',
	async ({ slug }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/lessons/slug/${slug}`, options)
			const { lesson } = response.data
			joinRoom(SOCKET_ROOM_TYPE.LESSON, lesson.id)
			if (lesson.subject?.id) joinRoom(SOCKET_ROOM_TYPE.SUBJECT, lesson.subject.id)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)
