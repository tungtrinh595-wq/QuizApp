import fs from 'fs'
import { google } from 'googleapis'

import {
	googleClientId,
	googleClientSecret,
	googleRefreshToken,
	googleDriverFolderId,
	googleClientCallback,
} from '../constants/index.js'

const oauth2Client = new google.auth.OAuth2(
	googleClientId,
	googleClientSecret,
	googleClientCallback
)
oauth2Client.setCredentials({
	refresh_token: googleRefreshToken,
})

const drive = google.drive({ version: 'v3', auth: oauth2Client })

export const uploadToGoogleDrive = async (filePath, fileName, mimeType) => {
	const fileMetadata = {
		name: fileName,
		parents: [googleDriverFolderId],
	}

	const media = {
		mimeType,
		body: fs.createReadStream(filePath),
	}

	const response = await drive.files.create({
		resource: fileMetadata,
		media,
		fields: 'id, name, mimeType, size, webViewLink, webContentLink',
	})

	return {
		id: response.data.id,
		name: response.data.name,
		mimeType: response.data.mimeType,
		size: response.data.size,
		url: response.data.webViewLink,
		downloadUrl: response.data.webContentLink,
	}
}

export const deleteFileFromGoogleDrive = async (fileId) => {
	try {
		await drive.files.delete({ fileId })
		return { success: true, message: 'File đã được xóa khỏi Google Drive' }
	} catch (err) {
		return { success: false, message: 'Xóa file thất bại', error: err.message }
	}
}
