import mongoose from 'mongoose'

import { deleteMediaFile, resolveMediaObject } from '../utils/utils.js'

const { Schema } = mongoose

const lessonFileSchema = new Schema(
	{
		lesson: {
			type: Schema.Types.ObjectId,
			ref: 'Lesson',
			required: true,
			index: true,
		},
		file: {
			type: Schema.Types.ObjectId,
			ref: 'Media',
			required: false,
			index: true,
		},
	},
	{ timestamps: true }
)

lessonFileSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v
		ret.file = resolveMediaObject(ret.file, { hasReview: true })

		return ret
	},
	virtuals: true,
})

export const convertLessonFileToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	const file = resolveMediaObject(ret.file)
	return {
		...rest,
		id: _id,
		file: resolveMediaObject(ret.file, { hasReview: true }),
	}
}

lessonFileSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		if (this.file) await deleteMediaFile(this.file)
		next()
	} catch (err) {
		next(err)
	}
})

const LessonFile = mongoose.model('LessonFile', lessonFileSchema)

export default LessonFile
