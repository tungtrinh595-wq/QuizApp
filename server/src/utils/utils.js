import fs, { promises as fsPromises } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'

import { DEFAULT, FOLDER_PATH, CLIENT_FOLDER_PATH, serverUrl } from '../constants/index.js'
import Media from '../models/Media.js'
import * as mediaService from '../services/medias.js'

export const deleteFile = async (filename, folderPath = FOLDER_PATH) => {
	if (!filename || typeof filename !== 'string') return
	const filePath = resolve(process.cwd(), folderPath, filename)

	try {
		return await fsPromises.unlink(filePath)
	} catch (err) {
		if (err.code !== 'ENOENT') console.warn(`Unable to delete file: ${filePath}`, err.message)
	}
}

export const deleteMediaFile = async (media, folderPath = FOLDER_PATH) => {
	if (!media) return
	if (typeof media === 'string' && !isObjectId(media)) return await deleteFile(media, folderPath)
	if (isObjectId(media)) return await mediaService.deleteMediaById(media)
	if (media instanceof Media) return await mediaService.deleteMedia(media)
	return
}

export const isValidUrl = (str) => {
	try {
		new URL(str)
		return true
	} catch {
		return false
	}
}

const resolvePath = (filename, folderPath, fallback = '') => {
	const isClientFolder = folderPath === CLIENT_FOLDER_PATH
	const fallbackPath = fallback || filename
	if (isClientFolder) return `/${folderPath}${fallbackPath}`

	if (!filename || typeof filename !== 'string' || filename.trim() === '')
		return fallback ? `${serverUrl}/${fallback}` : ''

	if (isValidUrl(filename)) return filename

	const absolutePath = resolve(process.cwd(), folderPath, filename)
	const fileExists = fs.existsSync(absolutePath)
	if (fileExists) return `${serverUrl}/${folderPath}${filename}`

	return `${serverUrl}/${fallback}`
}

export const resolveAvatarPath = (filename) =>
	resolvePath(filename, CLIENT_FOLDER_PATH, DEFAULT.AVATAR)

export const resolveImagePath = (filename) =>
	resolvePath(filename, CLIENT_FOLDER_PATH, DEFAULT.IMAGE)

export const resolveFilePath = (filename) => resolvePath(filename, FOLDER_PATH)

export const resolveFileReviewPath = (filename, fileType) => {
	switch (fileType) {
		case 'zip':
			return resolvePath(DEFAULT.ZIP, CLIENT_FOLDER_PATH)

		case 'rar':
			return resolvePath(DEFAULT.RAR, CLIENT_FOLDER_PATH)

		case 'pdf':
			return resolvePath(DEFAULT.PDF, CLIENT_FOLDER_PATH)

		case 'doc':
		case 'docx':
			return resolvePath(DEFAULT.WORD, CLIENT_FOLDER_PATH)

		case 'xls':
		case 'xlsx':
			return resolvePath(DEFAULT.EXCEL, CLIENT_FOLDER_PATH)

		case 'ppt':
		case 'pptx':
			return resolvePath(DEFAULT.POWERPOINT, CLIENT_FOLDER_PATH)

		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'gif':
			return resolvePath(filename, CLIENT_FOLDER_PATH, DEFAULT.IMAGE)

		default:
			return resolvePath(DEFAULT.IMAGE, CLIENT_FOLDER_PATH)
	}
}

export const isObjectId = (value) =>
	mongoose.Types.ObjectId.isValid(value) && value instanceof mongoose.Types.ObjectId

export const resolveMediaObject = (
	media,
	{ mediaType = 'image', isAvatar = false, hasReview = false } = {}
) => {
	if (!media || typeof media !== 'object' || isObjectId(media)) {
		const filename = typeof media === 'string' ? media : ''
		const result = {
			filename,
			url:
				mediaType === 'image'
					? isAvatar
						? resolveAvatarPath(filename)
						: resolveImagePath(filename)
					: resolveFilePath(filename),
		}
		if (hasReview) result.reviewUrl = resolveFileReviewPath(filename)
		return result
	}

	const {
		_id,
		id,
		filename = '',
		url = '',
		public_id = '',
		resource_type = '',
		format = '',
		size = 0,
		uploader,
	} = media
	const result = {
		id: _id || id || '',
		filename,
		url,
		public_id,
		resource_type,
		format,
		size,
		uploader,
	}
	if (hasReview) result.reviewUrl = resolveFileReviewPath(url, format)
	return result
}

export const applyPopulate = (query, withDetails, populate) =>
	withDetails ? query.populate(populate) : query

export const unflattenQueryObject = (flatObj) => {
	const result = {}
	for (const key in flatObj) {
		const keys = key.split('.')
		keys.reduce((acc, k, i) => {
			if (i === keys.length - 1) {
				acc[k] = flatObj[key]
			} else {
				acc[k] = acc[k] || {}
			}
			return acc[k]
		}, result)
	}
	return result
}

export const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const generateUniqueSlug = async (baseSlug, model, currentSlug) => {
	let finalSlug = baseSlug
	let count = 1

	while (
		await model.exists({
			$and: [{ slug: finalSlug }, ...(currentSlug ? [{ slug: { $ne: currentSlug } }] : [])],
		})
	) {
		finalSlug = `${baseSlug}-${count++}`
	}

	return finalSlug
}
