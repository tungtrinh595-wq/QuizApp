export const isProduction = process.env.NODE_ENV === 'production'
export const dbConnection = process.env.MONGO_URI
export const jwtSecretKey = process.env.JWT_SECRET
export const clientUrl = process.env.CLIENT_URL
export const serverUrl = process.env.SERVER_URL
export const googleClientId = process.env.GOOGLE_CLIENT_ID
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
export const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN
export const googleDriverFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID
export const googleClientCallback = process.env.GOOGLE_CLIENT_CALLBACK
export const mailtrapHost = process.env.MAILTRAP_HOST
export const mailtrapUsername = process.env.MAILTRAP_USER
export const mailtrapPassword = process.env.MAILTRAP_PASS

export const SALT_ROUNDS = 10
export const JWT_OPTIONS = { expiresIn: '7d' }
export const LIMIT_QUERY_DEFAULT = 20
export const MAX_DEPTH = 3
export const MAX_FILES = 5
export const MAX_SIZE = 20
export const FOLDER_PATH = 'public/'
export const CLIENT_FOLDER_PATH = 'defaults/'
export const DEFAULT = {
	IMAGE: 'default.jpg',
	AVATAR: 'avatar_default.jpg',
	ZIP: 'zip_file_icon.png',
	RAR: 'rar_file_icon.png',
	PDF: 'PDF_file_icon.png',
	WORD: 'MS_word_file_icon.png',
	EXCEL: 'MS_excel_file_icon.png',
	POWERPOINT: 'MS_powerpoint_file_icon.png',
}
export const PROVIDER = {
	EMAIL: 'email',
	GOOGLE: 'google',
	FACEBOOK: 'facebook',
}
export const ROLE = {
	USER: 'user',
	ADMIN: 'admin',
}
export const LESSON_STATUS = {
	DRAFT: 'draft',
	PUBLISHED: 'published',
}
export const QUIZ_TYPE = {
	PRACTICE: 'practice',
	EXAM: 'exam',
	SURVEY: 'survey',
}
export const QUESTION_TYPE = {
	MULTIPLE_CHOICE: 'multiple-choice',
	FILL_IN: 'fill-in',
}
export const POPULATE_FIELDS = {
	USER: '-password',
	QUESTION: 'question type explanation',
	ANSWER: 'answer isCorrect',
}
export const POPULATE = {
	USER: {
		path: 'createdBy',
		select: POPULATE_FIELDS.USER,
		populate: { path: 'avatar' },
	},
	SUBJECT: {
		path: 'subject',
		populate: { path: 'image' },
	},
	LESSONS: {
		path: 'lessons',
		options: { sort: { order: 1 } },
		populate: { path: 'image' },
	},
	SIMPLE_LESSONS: {
		path: 'lessons',
		options: { sort: { order: 1 } },
		populate: { path: 'image' },
		select: '-content',
	},
	LESSON_FILE: {
		path: 'lessonFiles',
		populate: { path: 'file' },
	},
	QUIZ: { path: 'quiz', populate: { path: 'image' } },
	SUBJECT_QUIZ: {
		path: 'quiz',
		populate: [{ path: 'image' }, { path: 'subject', populate: { path: 'image' } }],
	},
	QUIZZES: { path: 'quizzes', populate: { path: 'image' } },
	ANSWERS: {
		path: 'answers',
		populate: [
			{
				path: 'question',
				select: POPULATE_FIELDS.QUESTION,
				populate: {
					path: 'answers',
					select: POPULATE_FIELDS.ANSWER,
				},
			},
			{ path: 'answer', select: POPULATE_FIELDS.ANSWER },
		],
	},
	AVATAR: { path: 'avatar' },
	IMAGE: { path: 'image' },
}
export const HTTP_STATUS = {
	// 2xx Success
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,

	// 3xx Redirection
	MOVED_PERMANENTLY: 301,
	FOUND: 302,
	NOT_MODIFIED: 304,

	// 4xx Client Errors
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	UNSUPPORTED_MEDIA_TYPE: 415,
	UNPROCESSABLE_ENTITY: 422,
	TOO_MANY_REQUESTS: 429,

	// 5xx Server Errors
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
}
export const ALLOWED_FILE_TYPE = [
	'image/png',
	'image/jpg',
	'image/jpeg',
	'image/gif',
	'text/csv',
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/zip',
	'application/x-rar',
	'application/x-rar-compressed',
	'application/octet-stream',
]
export const ALLOWED_IMAGE_TYPE = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
export const UPLOADER = {
	GOOGLE_DRIVE: 'google_drive',
	CLOUDINARY: 'cloudinary',
}
