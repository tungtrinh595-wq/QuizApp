import { parse } from 'path'

import { HTTP_STATUS } from '../constants/index.js'
import cloudinary from '../config/cloudinary.js'
import {
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
	PayloadTooLargeError,
	UnauthorizedError,
	UnsupportedMediaTypeError,
} from './errors.js'

export const handleCloudinaryError = (err, prefix = 'Upload Cloudinary thất bại') => {
	if (!err || typeof err !== 'object')
		throw new InternalServerError(`${prefix}: Lỗi không xác định.`)

	const code = err.http_code || HTTP_STATUS.INTERNAL_SERVER_ERROR
	const message = err.message || 'Lỗi không xác định'

	switch (code) {
		case HTTP_STATUS.BAD_REQUEST:
			if (message.includes('Empty file'))
				throw new BadRequestError(`${prefix}: File rỗng. Vui lòng chọn file hợp lệ.`)
			if (message.includes('Invalid image file'))
				throw new UnsupportedMediaTypeError(`${prefix}: Định dạng ảnh không hợp lệ.`)
			throw new BadRequestError(message)

		case HTTP_STATUS.UNAUTHORIZED:
			throw new UnauthorizedError(`${prefix}: Không có quyền truy cập Cloudinary`)

		case HTTP_STATUS.FORBIDDEN:
			throw new ForbiddenError(`${prefix}: Cloudinary từ chối quyền truy cập`)

		case HTTP_STATUS.NOT_FOUND:
			throw new NotFoundError(`${prefix}: Không tìm thấy tài nguyên trên Cloudinary`)

		case HTTP_STATUS.PAYLOAD_TOO_LARGE:
			throw new PayloadTooLargeError(`${prefix}: File vượt quá giới hạn kích thước`)

		case HTTP_STATUS.INTERNAL_SERVER_ERROR:
			throw new InternalServerError(`${prefix}: Lỗi nội bộ từ Cloudinary`)

		default:
			throw new InternalServerError(message)
	}
}

export const uploadToCloudinary = async (
	fileBuffer,
	{ folder = 'images', resource_type = 'auto', ...options } = {}
) => {
	try {
		return new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ ...options, folder, resource_type },
				(error, result) => {
					if (error) reject(error)
					else resolve(result)
				}
			)
			stream.end(fileBuffer)
		})
	} catch (err) {
		handleCloudinaryError(err)
	}
}

export const uploadToCloudinaryFromPath = async (
	filePath,
	{ folder = 'files', resource_type = 'auto', ...options } = {}
) => {
	try {
		const uploadOptions = {
			...options,
			folder,
			resource_type,
			public_id: options.public_id || parse(filePath).name,
		}
		return await cloudinary.uploader.upload(filePath, uploadOptions)
	} catch (err) {
		handleCloudinaryError(err)
	}
}

export const deleteMediaFromCloudinary = async (publicId, resourceType) => {
	try {
		const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
		return response
	} catch (err) {
		handleCloudinaryError(err)
	}
}
