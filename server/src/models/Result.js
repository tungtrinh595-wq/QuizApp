import mongoose from 'mongoose'

import * as resultService from '../services/results.js'

const { Schema } = mongoose

const resultSchema = new Schema(
	{
		quiz: {
			type: Schema.Types.ObjectId,
			ref: 'Quiz',
			required: true,
			index: true,
		},
		score: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},
		totalScore: {
			type: Number,
			required: true,
			default: 10,
			min: 1,
		},
		startedAt: {
			type: Date,
			required: true,
		},
		submittedAt: Date,
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
)

resultSchema.virtual('answers', {
	ref: 'ResultAnswer',
	localField: '_id',
	foreignField: 'result',
})

resultSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v

		return ret
	},
	virtuals: true,
})

export const convertResultToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
	}
}

resultSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		await resultService.deleteResultAnswers(this._id)
		next()
	} catch (err) {
		next(err)
	}
})

const Result = mongoose.model('Result', resultSchema)

export default Result
