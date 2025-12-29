import mongoose from 'mongoose'

const { Schema } = mongoose

const quizQuestionSchema = new Schema(
	{
		quiz: {
			type: Schema.Types.ObjectId,
			ref: 'Quiz',
			required: true,
		},
		question: {
			type: Schema.Types.ObjectId,
			ref: 'Question',
			required: true,
		},
		order: Number,
	},
	{ timestamps: true }
)

quizQuestionSchema.index({ quiz: 1, question: 1 }, { unique: true })

quizQuestionSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v

		return ret
	},
	virtuals: true,
})

export const convertQuizQuestionToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
	}
}

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema)

export default QuizQuestion
