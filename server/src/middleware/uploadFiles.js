import fs from 'fs'
import multer from 'multer'
import { extname, resolve } from 'path'

import {
	ALLOWED_FILE_TYPE,
	FOLDER_PATH,
	MAX_FILES,
	MAX_SIZE,
	UPLOADER,
} from '../constants/index.js'
import { deleteFile } from '../utils/utils.js'
import { uploadToGoogleDrive } from '../utils/uploadToGoogleDrive.js'
import { uploadToCloudinaryFromPath } from '../utils/uploadToCloudinary.js'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
	if (ALLOWED_FILE_TYPE.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error('Định dạng file không được hỗ trợ'), false)
	}
}

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: MAX_SIZE * 1024 * 1024,
	},
})
export const uploadFiles = upload.array('files', MAX_FILES)

export const saveFile = (file, folder = FOLDER_PATH) => {
	if (!file) return null

	const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8')
	const fileType = extname(decodedName).replace('.', '').toLowerCase()
	const fileName = decodedName.replace(extname(decodedName), '')
	const safeName = `file-${Date.now()}${extname(decodedName)}`
	const filePath = resolve(process.cwd(), folder, safeName)
	const folderPath = resolve(process.cwd(), folder)

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}

	try {
		fs.writeFileSync(filePath, file.buffer)
		return { savedName: safeName, fileName, fileType, filePath }
	} catch (err) {
		throw new InternalServerError('Lỗi lưu file: ', err.message)
	}
}

export const storeFilesUploaded = async (req, res, next) => {
	if (!req.files || req.files.length === 0) return next()

	try {
		const uploadedFiles = await Promise.all(
			req.files.map(async (file) => {
				const { savedName, fileName, fileType, filePath } = saveFile(file)

				const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)
				const isVideo = ['mp4', 'mov', 'avi'].includes(fileType)

				if (isImage || isVideo) {
					let resource_type = isImage ? 'image' : 'video'
					const uploadPath = filePath.replace(`.${fileType}`, '')
					const result = await uploadToCloudinaryFromPath(filePath, {
						public_id: uploadPath,
						resource_type,
					})
					await deleteFile(savedName)
					return {
						...result,
						filename: fileName,
						fileType,
						url: result.secure_url,
						public_id: result.public_id,
						resource_type: result.resource_type,
						format: result.format || fileType,
						size: result.bytes,
						uploader: UPLOADER.CLOUDINARY,
					}
				} else {
					const result = await uploadToGoogleDrive(filePath, savedName, file.mimetype)
					await deleteFile(savedName)
					return {
						filename: fileName,
						fileType,
						url: result.url,
						public_id: result.id,
						downloadUrl: result.downloadUrl,
						resource_type: 'raw',
						format: fileType,
						size: result.size,
						uploader: UPLOADER.GOOGLE_DRIVE,
					}
				}
			})
		)

		req.files = uploadedFiles
		next()
	} catch (err) {
		next(err)
	}
}
