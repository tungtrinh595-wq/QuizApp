import mongoose from 'mongoose'

import Result from './Result.js'
import QuizQuestion from './QuizQuestion.js'
import { QUIZ_TYPE } from '../constants/index.js'
import { deleteMediaFile, resolveMediaObject } from '../utils/utils.js'

const { Schema } = mongoose

const quizSchema = new Schema(
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
		type: {
			type: String,
			enum: Object.values(QUIZ_TYPE),
			default: QUIZ_TYPE.EXAM,
		},
		timeStart: Date,
		timeLimit: {
			type: Number,
			min: 1,
		},
		totalScore: {
			type: Number,
			required: true,
			default: 10,
			min: 1,
		},
		passScore: {
			type: Number,
			required: true,
			default: 5,
			min: 0,
		},
		isRandom: {
			type: Boolean,
			default: false,
		},
		randomCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
)

quizSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v
		ret.image = resolveMediaObject(ret.image)

		return ret
	},
	virtuals: true,
})

export const convertQuizToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
		image: resolveMediaObject(ret.image),
	}
}

quizSchema.virtual('quizQuestions', {
	ref: 'QuizQuestion',
	localField: '_id',
	foreignField: 'quiz',
})

quizSchema.pre('deleteOne', { document: true }, async function (next) {
	if (this.image) await deleteMediaFile(this.image)
	await Result.deleteMany({ quiz: this._id })
	await QuizQuestion.deleteMany({ quiz: this._id })
	next()
})

const Quiz = mongoose.model('Quiz', quizSchema)

export default Quiz
