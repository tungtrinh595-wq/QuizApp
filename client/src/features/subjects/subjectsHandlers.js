export const handleAddSubject = (state, action) => {
	state.isLoading = false

	const { subject } = action.payload
	if (!subject?.id) return
	state.subjectMap[subject.id] = subject
	if (Array.isArray(state.list)) {
		const exists = state.list.some((l) => l.id === subject.id)
		if (!exists) {
			state.list = [subject, ...state.list]
			state.total += 1
		}
	}
}

export const handleUpdateSubject = (state, action) => {
	state.isLoading = false

	const { subject } = action.payload
	if (!subject?.id) return
	state.subjectMap[subject.id] = subject
	if (Array.isArray(state.list))
		state.list = state.list.map((s) => (s.id === subject.id ? subject : s))
}

export const handleRemoveSubject = (state, action) => {
	state.isLoading = false

	const { id: subjectId } = action.payload
	if (!subjectId) return
	delete state.subjectMap[subjectId]
	if (Array.isArray(state.list)) state.list = state.list.filter((s) => s.id !== subjectId)
	state.total = Math.max(0, state.total - 1)
}

export const handleSetSubjectsList = (state, action) => {
	state.isLoading = false

	const { subjects, total } = action.payload || {}
	if (Array.isArray(subjects)) state.list = subjects
	if (typeof total === 'number') state.total = total
}

export const handleAddSubjectLesson = (state, action) => {
	state.isLoading = false

	const { lesson, subjectId } = action.payload || {}
	const currentSubject = subjectId ? state.subjectMap?.[subjectId] : null
	if (currentSubject && Array.isArray(currentSubject.lessons)) {
		const updatedSubject = {
			...currentSubject,
			lessons: [...(currentSubject.lessons || []), lesson],
		}
		state.subjectMap[subjectId] = updatedSubject
	}
}

export const handleUpdateSubjectLesson = (state, action) => {
	state.isLoading = false

	const { lesson, subjectId } = action.payload || {}
	const currentSubject = subjectId ? state.subjectMap?.[subjectId] : null
	if (currentSubject && Array.isArray(currentSubject.lessons)) {
		const updatedLessons = currentSubject.lessons.map((l) => (l.id === lesson.id ? lesson : l))
		const updatedSubject = { ...currentSubject, lessons: updatedLessons }
		state.subjectMap[subjectId] = updatedSubject
	}
}

export const handleRemoveSubjectLesson = (state, action) => {
	state.isLoading = false

	const { lesson, subjectId } = action.payload || {}
	const currentSubject = subjectId ? state.subjectMap?.[subjectId] : null
	if (currentSubject && Array.isArray(currentSubject.lessons)) {
		const subjectEntry = Object.values(state.subjectMap || {}).find(
			(subj) => Array.isArray(subj.lessons) && subj.lessons.some((l) => l.id === lesson.id)
		)

		if (subjectEntry) {
			const updatedSubject = {
				...subjectEntry,
				lessons: subjectEntry.lessons.filter((l) => l.id !== lesson.id),
			}
			state.subjectMap[subjectId] = updatedSubject
		}
	}
}

export const handleUpdateOrdersSubjectLesson = (state, action) => {
	const { lessons, subjectId } = action.payload
	Object.values(state.subjectMap || {}).forEach((subject) => {
		if (Array.isArray(subject.lessons)) {
			const updatedSubjectLessons = subject.lessons.map((lesson) => {
				const updated = lessons.find((l) => l.id === lesson.id)
				return updated && typeof updated.order === 'number'
					? { ...lesson, order: updated.order }
					: lesson
			})

			const updatedSubject = {
				...subject,
				lessons: updatedSubjectLessons,
			}

			state.subjectMap[subjectId] = updatedSubject
			if (Array.isArray(state.list))
				state.list = state.list.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
		}
	})
}
