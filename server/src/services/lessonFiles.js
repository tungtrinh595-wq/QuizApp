import LessonFile from '../models/LessonFile.js'
import * as mediaService from './medias.js'

export const findLessonFileById = async (id) => await LessonFile.findById(id)

export const updateLessonFiles = async ({ lesson, removeFileIds, files }) => {
	const documents = await Promise.all(
		files.map(async (f) => {
			const file = await mediaService.saveMedia(f)
			return { lesson: lesson.id, file }
		})
	)
	const insertedDocs = await LessonFile.insertMany(documents)
	const uploadedFiles = insertedDocs.map((f) => f.toJSON())

	const removeIds = removeFileIds || []
	const deletedDocs = await LessonFile.find({ _id: { $in: removeIds } })
	for (const fileDoc of deletedDocs) await fileDoc.deleteOne()
	const deletedFiles = deletedDocs.map((f) => f.toJSON())

	return { deletedFiles, uploadedFiles }
}

export const deleteLessonFile = async (lessonFile) => await lessonFile.deleteOne()

export const deleteLessonFiles = async ({ lessonId }) => {
	const filesToDelete = await LessonFile.find({ lesson: lessonId })
	const failedDeletes = []
	for (const fileDoc of filesToDelete) {
		try {
			await fileDoc.deleteOne()
		} catch (err) {
			console.warn('Failed to delete file:', fileDoc.file, err)
			failedDeletes.push(fileDoc.file)
		}
	}

	if (failedDeletes.length > 0) {
		console.warn('Failed to delete files:', failedDeletes)
	}

	return filesToDelete.map((f) => f.toJSON())
}
