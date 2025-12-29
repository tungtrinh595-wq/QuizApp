import mongoose from 'mongoose'

import Answer from './Answer.js'
import QuizQuestion from './QuizQuestion.js'
import { QUESTION_TYPE } from '../constants/index.js'
import agenda from '../../jobs/agenda.js'

const { Schema } = mongoose

const questionSchema = new Schema(
	{
		subject: {
			type: Schema.Types.ObjectId,
			ref: 'Subject',
			required: true,
			index: true,
		},
		question: {
			type: String,
			required: true,
			minLength: 1,
		},
		type: {
			type: String,
			enum: Object.values(QUESTION_TYPE),
			default: QUESTION_TYPE.MULTIPLE_CHOICE,
			required: true,
		},
		explanation: String,
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
)

questionSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v

		return ret
	},
	virtuals: true,
})

questionSchema.set('toObject', { virtuals: true })

export const convertQuestionToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
	}
}

questionSchema.virtual('answers', {
	ref: 'Answer',
	localField: '_id',
	foreignField: 'question',
})

questionSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		await agenda.now('preserveQuestionSnapshot', { questionId: this._id })
		await Answer.deleteMany({ question: this._id })
		await QuizQuestion.deleteMany({ question: this._id })
		next()
	} catch (err) {
		next(err)
	}
})

const Question = mongoose.model('Question', questionSchema)

export default Question
