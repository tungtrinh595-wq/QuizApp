import mongoose from 'mongoose'

import { LESSON_STATUS } from '../constants/index.js'
import { deleteMediaFile, resolveMediaObject } from '../utils/utils.js'

import * as lessonFileService from '../services/lessonFiles.js'
import * as messagesService from '../services/messages.js'

const { Schema } = mongoose

const lessonSchema = new Schema(
	{
		subject: {
			type: Schema.Types.ObjectId,
			ref: 'Subject',
			required: true,
			index: true,
		},
		title: {
			type: String,
			minlength: 2,
			maxlength: 50,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			match: [/^[a-zA-Z0-9_-]+$/],
			index: true,
		},
		image: {
			type: Schema.Types.ObjectId,
			ref: 'Media',
			required: false,
			index: true,
		},
		description: String,
		content: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			enum: Object.values(LESSON_STATUS),
			default: LESSON_STATUS.DRAFT,
		},
		order: Number,
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
)

lessonSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v
		ret.image = resolveMediaObject(ret.image)

		return ret
	},
	virtuals: true,
})

export const convertLessonToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
		image: resolveMediaObject(ret.image),
	}
}

lessonSchema.virtual('lessonFiles', {
	ref: 'LessonFile',
	localField: '_id',
	foreignField: 'lesson',
})

lessonSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		const lessonId = this._id
		if (this.image) await deleteMediaFile(this.image)
		await lessonFileService.deleteLessonFiles(lessonId)
		await messagesService.deleteLessonMessages(lessonId)
		next()
	} catch (err) {
		next(err)
	}
})

const Lesson = mongoose.model('Lesson', lessonSchema)

export default Lesson
