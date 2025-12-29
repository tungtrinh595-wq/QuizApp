import { createAsyncThunk } from '@reduxjs/toolkit'

import { HTTP_STATUS, LIMIT_QUERY_DEFAULT } from '@/constants'
import { api } from '@/apis'
import { attachTokenToHeaders, flattenQueryObject } from '@/utils'
import { getLessonMessagesState, updateMessageTree } from './messagesHandles'

export const getMessages = createAsyncThunk(
	'messages/getMessages',
	async ({ lessonId, cursor, limit = LIMIT_QUERY_DEFAULT }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			options.params = flattenQueryObject({ cursor, limit })
			const response = await api.get(`/api/lessons/${lessonId}/messages`, options)
			const { messages, nextCursor, hasMore } = response.data
			const lessonMessages = getLessonMessagesState(getState().messages, lessonId)
			return {
				lessonId,
				messages: [...lessonMessages, ...messages],
				nextCursor,
				hasMore,
			}
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const createMessage = createAsyncThunk(
	'messages/createMessage',
	async ({ lessonId, formData, thread = [] }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post('/api/messages', { ...formData, thread }, options)
			const { message } = response.data
			const lessonMessages = getLessonMessagesState(getState().messages, lessonId)
			const messages = updateMessageTree(
				lessonMessages,
				thread,
				(prevReplies) => [message, ...prevReplies],
				true
			)
			return { lessonId, messages }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const editMessage = createAsyncThunk(
	'messages/editMessage',
	async ({ id, lessonId, formData, thread = [] }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/messages/${id}`, { ...formData, thread }, options)
			const { message } = response.data
			const lessonMessages = getLessonMessagesState(getState().messages, lessonId)
			const messages = updateMessageTree(lessonMessages, thread, (prevMessages) =>
				prevMessages.map((m) => (m.id === message.id ? { ...m, ...message } : m))
			)
			return { lessonId, messages }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const deleteMessage = createAsyncThunk(
	'messages/deleteMessage',
	async ({ id, lessonId, thread = [] }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(`/api/messages/${id}`, options)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				const lessonMessages = getLessonMessagesState(getState().messages, lessonId)
				const messages = updateMessageTree(lessonMessages, thread, (prevMessages) =>
					prevMessages.filter((m) => m.id !== id)
				)
				return { lessonId, messages }
			}

			return rejectWithValue({ message: 'Trạng thái phản hồi không mong đợi' })
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)
