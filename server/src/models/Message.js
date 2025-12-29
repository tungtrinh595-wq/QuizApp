import mongoose from 'mongoose'

import * as messagesService from '../services/messages.js'

const { Schema } = mongoose

const messageSchema = new Schema(
	{
		text: {
			type: String,
			minLength: 1,
			maxLength: 500,
			required: true,
		},
		lesson: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Lesson',
			required: true,
			index: true,
		},
		parentMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
			default: null,
			index: true,
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

messageSchema.set('toJSON', {
	virtuals: true,
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v

		return ret
	},
	virtuals: true,
})

export const convertMessageToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
	}
}

messageSchema.virtual('replies', {
	ref: 'Message',
	localField: '_id',
	foreignField: 'parentMessage',
})

messageSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		const idsToDelete = await messagesService.collectReplyIds([this._id])
		if (idsToDelete.length > 0) await Message.deleteMany({ _id: { $in: idsToDelete } })
		next()
	} catch (err) {
		next(err)
	}
})

messageSchema.pre('findOneAndDelete', async function (next) {
	try {
		const idsToDelete = await messagesService.collectReplyIds([this.getQuery()._id])
		if (idsToDelete.length > 0) await Message.deleteMany({ _id: { $in: idsToDelete } })
		next()
	} catch (err) {
		next(err)
	}
})

const Message = mongoose.model('Message', messageSchema)

export default Message
