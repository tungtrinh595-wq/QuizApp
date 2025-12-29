import multer from 'multer'

import { ALLOWED_IMAGE_TYPE, MAX_SIZE, UPLOADER } from '../constants/index.js'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js'
import { saveMedia } from '../services/medias.js'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
	if (ALLOWED_IMAGE_TYPE.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(null, false)
		cb(new Error('Định dạng file không được hỗ trợ!'))
	}
}

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: MAX_SIZE * 1024 * 1024,
	},
})

export const uploadImage = upload.single('image')

export const storeImageUploaded = async (req, res, next) => {
	if (!req.file) return next()

	const result = await uploadToCloudinary(req.file.buffer)
	const fileUploaded = {
		...result,
		filename: result.original_filename,
		url: result.secure_url,
		public_id: result.public_id,
		resource_type: result.resource_type,
		format: result.format,
		size: result.bytes,
		uploader: UPLOADER.CLOUDINARY,
	}
	const media = await saveMedia(fileUploaded)
	req.file = media
	next()
}
