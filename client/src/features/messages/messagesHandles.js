export const getLessonMessagesState = (state, lessonId) =>
	state.lessonMap?.[lessonId]?.messages || []

export const updateMessageTree = (tree, thread, updater, isAdd = false) => {
	if (thread.length === (isAdd ? 0 : 1)) return updater(tree)
	const [head, ...rest] = thread
	return tree.map((msg) =>
		msg.id === head
			? {
					...msg,
					replies: updateMessageTree(msg.replies || [], rest, updater, isAdd),
			  }
			: msg
	)
}

const updateLessonMessages = (state, lessonId, thread, updater, isAdd = false) => {
	const lessonMessages = getLessonMessagesState(state, lessonId)
	const messages = updateMessageTree(lessonMessages, thread, updater, isAdd)
	const prev = state.lessonMap[lessonId] || {}
	state.lessonMap[lessonId] = {
		...prev,
		messages,
		isLoading: false,
		error: null,
	}
}

export const handleAddMessage = (state, action) => {
	const { lessonId, message, thread } = action.payload
	updateLessonMessages(state, lessonId, thread, (prevReplies) => [message, ...prevReplies], true)
}

export const handleUpdateMessage = (state, action) => {
	const { lessonId, message, thread } = action.payload
	updateLessonMessages(state, lessonId, thread, (prevMessages) =>
		prevMessages.map((m) => (m.id === message.id ? { ...m, ...message } : m))
	)
}

export const handleRemoveMessage = (state, action) => {
	const { lessonId, message, thread } = action.payload
	if (message?.id)
		updateLessonMessages(state, lessonId, thread, (prevMessages) =>
			prevMessages.filter((m) => m.id !== message.id)
		)
}
