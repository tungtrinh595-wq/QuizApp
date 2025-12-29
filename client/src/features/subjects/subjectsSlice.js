import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { extractError } from '@/utils'
import {
	getSubjects,
	getSubjectDetails,
	getSubjectDetailsBySlug,
	createSubject,
	editSubject,
	deleteSubject,
} from './subjectsThunks'
import {
	handleAddSubject,
	handleUpdateSubject,
	handleRemoveSubject,
	handleSetSubjectsList,
	handleAddSubjectLesson,
	handleUpdateSubjectLesson,
	handleRemoveSubjectLesson,
	handleUpdateOrdersSubjectLesson,
} from './subjectsHandlers'

const initialState = {
	list: null,
	subjectMap: {
		// [subjectId]: Subject
	},
	isLoading: false,
	error: null,
	total: 0,
}

const subjectsSlice = createSlice({
	name: 'subjects',
	initialState,
	reducers: {
		setSubjectsList(state, action) {
			handleSetSubjectsList(state, action)
		},
		addSubject(state, action) {
			handleAddSubject(state, action)
		},
		updateSubject(state, action) {
			handleUpdateSubject(state, action)
		},
		removeSubject(state, action) {
			handleRemoveSubject(state, action)
		},
		addSubjectLesson(state, action) {
			handleAddSubjectLesson(state, action)
		},
		updateSubjectLesson(state, action) {
			handleUpdateSubjectLesson(state, action)
		},
		removeSubjectLesson(state, action) {
			handleRemoveSubjectLesson(state, action)
		},
		updateOrdersSubjectLesson(state, action) {
			handleUpdateOrdersSubjectLesson(state, action)
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getSubjects.fulfilled, (state, action) => {
				handleSetSubjectsList(state, action)
			})
			.addCase(createSubject.fulfilled, (state, action) => {
				handleAddSubject(state, action)
			})
			.addCase(editSubject.fulfilled, (state, action) => {
				handleUpdateSubject(state, action)
			})
			.addCase(deleteSubject.fulfilled, (state, action) => {
				handleRemoveSubject(state, action)
			})
			.addMatcher(
				(action) => action.type.endsWith('/pending') && action.type.startsWith('subjects/'),
				(state) => {
					state.isLoading = true
					state.error = null
				}
			)
			.addMatcher(
				isAnyOf(getSubjectDetails.fulfilled, getSubjectDetailsBySlug.fulfilled),
				(state, action) => {
					state.isLoading = false

					const { subject } = action.payload
					if (subject?.id) state.subjectMap[subject.id] = subject
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith('subjects/') &&
					action.type.includes('Question') &&
					action.type.endsWith('/fulfilled'),
				(state) => {
					state.isLoading = false
				}
			)
			.addMatcher(
				(action) => action.type.endsWith('/rejected') && action.type.startsWith('subjects/'),
				(state, action) => {
					state.isLoading = false
					state.error = extractError(action)
				}
			)
	},
})

export const {
	setSubjectsList,
	addSubject,
	updateSubject,
	removeSubject,
	addSubjectLesson,
	updateSubjectLesson,
	removeSubjectLesson,
	updateOrdersSubjectLesson,
} = subjectsSlice.actions
export default subjectsSlice.reducer
