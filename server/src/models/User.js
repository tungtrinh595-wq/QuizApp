import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { jwtSecretKey, JWT_OPTIONS, ROLE, SALT_ROUNDS, PROVIDER } from '../constants/index.js'
import { deleteMediaFile, resolveMediaObject } from '../utils/utils.js'

import * as messageService from '../services/messages.js'
import * as resultService from '../services/results.js'

const { Schema } = mongoose

const userSchema = new Schema(
	{
		provider: {
			type: String,
			enum: Object.values(PROVIDER),
			default: PROVIDER.EMAIL,
			required: true,
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			match: [/\S+@\S+\.\S+/],
			index: true,
		},
		slug: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			match: [/^[a-zA-Z0-9_-]+$/],
			index: true,
		},
		password: {
			type: String,
			trim: true,
			minlength: 6,
			maxlength: 60,
		},
		name: String,
		avatar: {
			type: Schema.Types.ObjectId,
			ref: 'Media',
			required: false,
			index: true,
		},
		role: {
			type: String,
			enum: Object.values(ROLE),
			default: ROLE.USER,
			index: true,
		},
		bio: String,
		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},
		facebookId: {
			type: String,
			unique: true,
			sparse: true,
		},
		isActive: {
			type: Boolean,
			default: true,
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
)

userSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v
		delete ret.password
		ret.avatar = resolveMediaObject(ret.avatar, { isAvatar: true })

		return ret
	},
	virtuals: true,
})

export const convertUserToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, password, ...rest } = ret
	return {
		...rest,
		id: _id,
		avatar: resolveMediaObject(ret.avatar, { isAvatar: true }),
	}
}

userSchema.methods.generateJWT = function () {
	return jwt.sign(
		{
			id: this._id,
			provider: this.provider,
			email: this.email,
			role: this.role,
		},
		jwtSecretKey,
		JWT_OPTIONS
	)
}

userSchema.methods.registerUser = async function () {
	if (this.provider === PROVIDER.EMAIL && this.password) {
		this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
	}
	return await this.save()
}

userSchema.methods.comparePassword = async function (candidatePassword) {
	if (!this.password) return false
	return bcrypt.compare(candidatePassword, this.password)
}

export async function hashPassword(password) {
	return bcrypt.hash(password, SALT_ROUNDS)
}

userSchema.virtual('results', {
	ref: 'Result',
	localField: '_id',
	foreignField: 'createdBy',
})

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		const userId = this._id
		if (this.avatar) await deleteMediaFile(this.avatar)
		await messageService.deleteUserMessages(userId)
		await resultService.deleteUserResults(userId)
		next()
	} catch (err) {
		next(err)
	}
})

const User = mongoose.model('User', userSchema)

export default User
