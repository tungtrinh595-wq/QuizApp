import mongoose from 'mongoose'

import { deleteMediaFile, resolveMediaObject } from '../utils/utils.js'

import Lesson from '../models/Lesson.js'
import Question from '../models/Question.js'
import Quiz from '../models/Quiz.js'

const { Schema } = mongoose

const subjectSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 50,
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
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
)

subjectSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v
		ret.image = resolveMediaObject(ret.image)

		return ret
	},
	virtuals: true,
})

export const convertSubjectToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
		image: resolveMediaObject(ret.image),
	}
}

subjectSchema.virtual('lessons', {
	ref: 'Lesson',
	localField: '_id',
	foreignField: 'subject',
})

subjectSchema.virtual('questions', {
	ref: 'Question',
	localField: '_id',
	foreignField: 'subject',
})

subjectSchema.virtual('quizzes', {
	ref: 'Quiz',
	localField: '_id',
	foreignField: 'subject',
})

subjectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		if (this.image) await deleteMediaFile(this.image)
		const subjectId = this._id

		const lessons = await Lesson.find({ subject: subjectId })
		for (const lesson of lessons) {
			await lesson.deleteOne()
		}

		const questions = await Question.find({ subject: subjectId })
		for (const question of questions) {
			await question.deleteOne()
		}

		const quizzes = await Quiz.find({ subject: subjectId })
		for (const quiz of quizzes) {
			await quiz.deleteOne()
		}

		next()
	} catch (err) {
		next(err)
	}
})

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject
