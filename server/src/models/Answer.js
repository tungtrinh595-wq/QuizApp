import mongoose from 'mongoose'
import { ROLE } from '../constants/index.js'

const { Schema } = mongoose

const answerSchema = new Schema(
	{
		question: {
			type: Schema.Types.ObjectId,
			ref: 'Question',
			required: true,
			index: true,
		},
		answer: {
			type: String,
			required: true,
		},
		isCorrect: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
)

answerSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v

		return ret
	},
	virtuals: true,
})

export const convertAnswerToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
	}
}

answerSchema.methods.toJSONByRole = function (role) {
	const obj = this.toJSON()
	if (role && role === ROLE.ADMIN) return obj
	delete obj.isCorrect
	return obj
}

const Answer = mongoose.model('Answer', answerSchema)

export default Answer
