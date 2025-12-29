import mongoose from 'mongoose'

import { UPLOADER } from '../constants/index.js'
import { deleteMediaFromCloudinary } from '../utils/uploadToCloudinary.js'
import { deleteFileFromGoogleDrive } from '../utils/uploadToGoogleDrive.js'

const { Schema } = mongoose

const mediaSchema = new Schema(
	{
		filename: {
			type: String,
			default: '',
		},
		url: {
			type: String,
			default: '',
			require: true,
		},
		public_id: {
			type: String,
			default: '',
		},
		format: {
			type: String,
			default: '',
		},
		resource_type: {
			type: String,
			default: 'image',
		},
		size: {
			type: Number,
			default: 0,
		},
		uploader: {
			type: String,
			enum: Object.values(UPLOADER),
			default: UPLOADER.CLOUDINARY,
		},
	},
	{ timestamps: true }
)

mediaSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id
		delete ret._id
		delete ret.__v

		return ret
	},
	virtuals: true,
})

export const convertMediaToJSON = (ret) => {
	if (!ret) return null

	const { _id, __v, ...rest } = ret
	return {
		...rest,
		id: _id,
	}
}

mediaSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		if (this.public_id) {
			if (this.uploader === UPLOADER.CLOUDINARY)
				await deleteMediaFromCloudinary(this.public_id, this.resource_type)
			else if (this.uploader === UPLOADER.GOOGLE_DRIVE)
				await deleteFileFromGoogleDrive(this.public_id)
		}
		next()
	} catch (err) {
		next(err)
	}
})

mediaSchema.pre('findOneAndDelete', async function (next) {
	const doc = await this.model.findOne(this.getQuery())
	if (doc?.public_id) {
		if (doc?.uploader === UPLOADER.CLOUDINARY)
			await deleteMediaFromCloudinary(doc.public_id, doc.resource_type)
		else if (doc?.uploader === UPLOADER.GOOGLE_DRIVE) await deleteFileFromGoogleDrive(doc.public_id)
	}
	next()
})

const Media = mongoose.model('Media', mediaSchema)

export default Media
