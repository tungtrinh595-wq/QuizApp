import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { extractError } from '@/utils'
import { getMessages, createMessage, editMessage, deleteMessage } from './messagesThunks'
import { handleAddMessage, handleUpdateMessage, handleRemoveMessage } from './messagesHandles'

const initialState = {
	lessonMap: {
		// [lessonId]: {
		// 	messages: [Message],
		// 	nextCursor: MessageId,
		// 	hasMore: true,
		// 	isLoading: false,
		// 	error: null,
		// }
	},
	isLoading: false,
	error: null,
}

const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		addMessage(state, action) {
			handleAddMessage(state, action)
		},
		updateMessage(state, action) {
			handleUpdateMessage(state, action)
		},
		removeMessage(state, action) {
			handleRemoveMessage(state, action)
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				isAnyOf(
					getMessages.pending,
					createMessage.pending,
					editMessage.pending,
					deleteMessage.pending
				),
				(state) => {
					state.isLoading = true
					state.error = null
				}
			)
			.addMatcher(
				isAnyOf(
					getMessages.fulfilled,
					createMessage.fulfilled,
					editMessage.fulfilled,
					deleteMessage.fulfilled
				),
				(state, action) => {
					const { lessonId, messages, nextCursor, hasMore } = action.payload || {}
					const prev = state.lessonMap[lessonId] || {}
					state.lessonMap[lessonId] = {
						...prev,
						messages,
						...(nextCursor ? { nextCursor } : {}),
						...(hasMore !== undefined ? { hasMore } : {}),
						isLoading: false,
						error: null,
					}
					state.isLoading = false
				}
			)
			.addMatcher(
				isAnyOf(
					getMessages.rejected,
					createMessage.rejected,
					editMessage.rejected,
					deleteMessage.rejected
				),
				(state, action) => {
					state.isLoading = false
					state.error = extractError(action)
				}
			)
	},
})

export const { addMessage, updateMessage, removeMessage } = messagesSlice.actions
export default messagesSlice.reducer
