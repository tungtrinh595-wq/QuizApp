export const handleAddLesson = (state, action) => {
	state.isLoading = false

	const { lesson } = action.payload
	if (!lesson?.id) return
	state.lessonMap[lesson.id] = lesson
	if (Array.isArray(state.list)) {
		const exists = state.list.some((l) => l.id === lesson.id)
		if (!exists) {
			state.list = [lesson, ...state.list]
			state.total += 1
		}
	}
}

export const handleUpdateLesson = (state, action) => {
	state.isLoading = false

	const { lesson } = action.payload
	if (!lesson?.id) return
	state.lessonMap[lesson.id] = lesson
	if (Array.isArray(state.list))
		state.list = state.list.map((s) => (s.id === lesson.id ? lesson : s))
}

export const handleRemoveLesson = (state, action) => {
	state.isLoading = false

	const { id: lessonId } = action.payload
	if (!lessonId) return
	delete state.lessonMap[lessonId]
	if (Array.isArray(state.list)) state.list = state.list.filter((s) => s.id !== lessonId)
	state.total = Math.max(0, state.total - 1)
}

export const handleSetLessonsList = (state, action) => {
	state.isLoading = false

	const { lessons, total } = action.payload || {}
	if (Array.isArray(lessons)) state.list = lessons
	if (typeof total === 'number') state.total = total
}

export const handleUpdateOrdersLesson = (state, action) => {
	const { lessons } = action.payload
	const updatedLessonList = state.list
		? lessons.list.map((lesson) => {
				const updated = lessons.find((l) => l.id === lesson.id)
				return updated ? { ...lesson, order: updated.order } : lesson
		  })
		: lessons
	if (Array.isArray(state.list)) state.list = updatedLessonList
}

export const handleUploadLessonFiles = (state, action) => {
	const { lessonId, uploadedFiles } = action.payload
	const lesson = state.lessonMap?.[lessonId]

	if (lesson) {
		const updatedLesson = {
			...lesson,
			lessonFiles: [...(lesson.lessonFiles || []), ...uploadedFiles],
		}
		state.lessonMap[lesson.id] = updatedLesson
	}
}

export const handleRemoveLessonFile = (state, action) => {
	const { lessonId, lessonFileId } = action.payload
	const lesson = state.lessonMap?.[lessonId]

	if (lesson?.lessonFiles) {
		const updatedLesson = {
			...lesson,
			lessonFiles: lesson.lessonFiles.filter((file) => file.id !== lessonFileId),
		}
		state.lessonMap[lesson.id] = updatedLesson
	}
}
