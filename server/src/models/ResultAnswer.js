import mongoose from 'mongoose'
import { QUESTION_TYPE } from '../constants/index.js'

const { Schema } = mongoose

const resultAnswerSchema = new Schema(
	{
		result: {
			type: Schema.Types.ObjectId,
			ref: 'Result',
			required: true,
			index: true,
		},
		question: {
			type: Schema.Types.ObjectId,
			ref: 'Question',
		},
		answer: {
			type: Schema.Types.ObjectId,
			ref: 'Answer',
		},
		answerText: String,
		log: {
			question: String,
			type: {
				type: String,
				enum: Object.values(QUESTION_TYPE),
			},
			explanation: String,
			answers: [
				{
					id: String,
					answer: String,
					isCorrect: Boolean,
					_id: false,
				},
			],
		},
		isCorrect: { type: Boolean, default: false, required: true },
	},
	{ timestamps: true }
)

resultAnswerSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v

		return ret
	},
	virtuals: true,
})

export const convertResultAnswerToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
	}
}

const ResultAnswer = mongoose.model('ResultAnswer', resultAnswerSchema)

export default ResultAnswer
