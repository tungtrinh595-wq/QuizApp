import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { extractError } from '@/utils'
import {
	getLessons,
	getLessonDetails,
	createLesson,
	editLesson,
	deleteLesson,
	reorderLessons,
	deleteLessonFile,
	attachLessonFiles,
	getPublicLessons,
	getPublicLessonDetails,
} from './lessonsThunks'
import {
	handleAddLesson,
	handleUpdateLesson,
	handleRemoveLesson,
	handleSetLessonsList,
	handleRemoveLessonFile,
	handleUploadLessonFiles,
	handleUpdateOrdersLesson,
} from './lessonsHandlers'

const initialState = {
	list: null,
	lessonMap: {
		// [lessonId]: Lesson
	},
	isLoading: false,
	error: null,
	total: 0,
}

const lessonsSlice = createSlice({
	name: 'lessons',
	initialState,
	reducers: {
		setLessonsList(state, action) {
			handleSetLessonsList(state, action)
		},
		addLesson(state, action) {
			handleAddLesson(state, action)
		},
		updateLesson(state, action) {
			handleUpdateLesson(state, action)
		},
		removeLesson(state, action) {
			handleRemoveLesson(state, action)
		},
		updateOrdersLesson(state, action) {
			handleUpdateOrdersLesson(state, action)
		},
		uploadLessonFiles(state, action) {
			handleUploadLessonFiles(state, action)
		},
		removeLessonFile(state, action) {
			handleRemoveLessonFile(state, action)
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createLesson.fulfilled, (state, action) => {
				handleAddLesson(state, action)
			})
			.addCase(editLesson.fulfilled, (state, action) => {
				handleUpdateLesson(state, action)
			})
			.addCase(deleteLesson.fulfilled, (state, action) => {
				handleRemoveLesson(state, action)
			})
			.addCase(reorderLessons.fulfilled, (state, action) => {
				const updatedList = action.payload?.lessons || []
				const updatedMap = { ...state.lessonMap }
				updatedList.forEach((lesson) => {
					if (lesson?.id) {
						updatedMap[lesson.id] = {
							...updatedMap[lesson.id],
							order: lesson.order,
						}
					}
				})
				state.list = updatedList
				state.lessonMap = updatedMap
				state.isLoading = false
			})
			.addCase(deleteLessonFile.pending, (state) => {
				state.error = null
			})
			.addCase(deleteLessonFile.fulfilled, (state, action) => {
				const { lesson } = action.payload
				if (lesson?.id) state.lessonMap[lesson.id] = lesson
			})
			.addMatcher(
				(action) =>
					action.type.startsWith('lessons/') &&
					action.type.endsWith('/pending') &&
					!['lessons/deleteLessonFile/pending'].includes(action.type),
				(state) => {
					state.isLoading = true
					state.error = null
				}
			)
			.addMatcher(isAnyOf(getLessons.fulfilled, getPublicLessons.fulfilled), (state, action) => {
				handleSetLessonsList(state, action)
			})
			.addMatcher(
				isAnyOf(
					getLessonDetails.fulfilled,
					getPublicLessonDetails.fulfilled,
					attachLessonFiles.fulfilled,
					deleteLessonFile.fulfilled
				),
				(state, action) => {
					state.isLoading = false

					const { lesson } = action.payload
					if (lesson?.id) state.lessonMap[lesson.id] = lesson
				}
			)
			.addMatcher(
				(action) => action.type.startsWith('lessons/') && action.type.endsWith('/rejected'),
				(state, action) => {
					state.isLoading = false
					state.error = extractError(action)
				}
			)
	},
})

export const {
	setLessonsList,
	addLesson,
	updateLesson,
	removeLesson,
	removeLessonFile,
	uploadLessonFiles,
	updateOrdersLesson,
} = lessonsSlice.actions
export default lessonsSlice.reducer
