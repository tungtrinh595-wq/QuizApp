import Joi from 'joi'
import { QUESTION_TYPE, QUIZ_TYPE, ROLE, LESSON_STATUS } from '../constants/index.js'
import { BadRequestError } from '../utils/errors.js'

export const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

export const validate =
	(schema, source = 'body') =>
	(req, res, next) => {
		const { error } = schema.validate(req[source], { abortEarly: false })
		if (error)
			return next(
				new BadRequestError('Validation failed: ' + error.details.map((d) => d.message).join(', '))
			)
		next()
	}

// database Schemas
export const userSchema = Joi.object({
	name: Joi.string().min(2).max(30).required(),
	email: Joi.string().trim().email().required(),
	password: Joi.string().min(6).max(20).allow(null, ''),
})

export const userUpdateSchema = Joi.object({
	name: Joi.string().min(2).max(30).optional().allow(null),
	password: Joi.string().min(6).max(20).optional().allow(null),
	slug: Joi.string().optional().allow(null),
	bio: Joi.string().optional().allow(null, ''),
	role: Joi.string()
		.valid(...Object.values(ROLE))
		.optional()
		.allow(null),
})

export const subjectSchema = Joi.object({
	title: Joi.string().min(2).max(50).required(),
	description: Joi.string(),
})

export const subjectUpdateSchema = Joi.object({
	title: Joi.string().min(2).max(50).optional().allow(null),
	description: Joi.string().optional().allow(null),
})

export const lessonSchema = Joi.object({
	title: Joi.string().min(2).max(50).required(),
	description: Joi.string(),
	content: Joi.string().optional().allow(null, ''),
	status: Joi.string()
		.valid(...Object.values(LESSON_STATUS))
		.default(LESSON_STATUS.DRAFT),
	subjectId: objectId.required().messages({
		'any.required': 'subjectId is required',
		'string.pattern.base': 'subjectId must be a valid ObjectId',
	}),
})

export const lessonFileSchema = Joi.object({
	removeFileIds: Joi.array()
		.items(
			objectId.messages({
				'string.pattern.base': 'Each file ID must be a valid ObjectId',
			})
		)
		.optional()
		.allow(null),
})

export const lessonUpdateSchema = Joi.object({
	title: Joi.string().min(2).max(50).optional().allow(null),
	description: Joi.string().optional().allow(null),
	content: Joi.string().optional().allow(null, ''),
	status: Joi.string()
		.optional()
		.allow(null)
		.valid(...Object.values(LESSON_STATUS)),
	subjectId: objectId.optional().allow(null).messages({
		'string.pattern.base': 'subjectId must be a valid ObjectId',
	}),
})

export const messageSchema = Joi.object({
	text: Joi.string().min(1).max(500).required(),
	lessonId: objectId.required().messages({
		'any.required': 'lessonId is required',
		'string.pattern.base': 'lessonId must be a valid ObjectId',
	}),
	parentMessageId: objectId.optional().allow(null).messages({
		'string.pattern.base': 'parentMessageId must be a valid ObjectId',
	}),
	thread: Joi.array()
		.items(
			objectId.messages({
				'string.pattern.base': 'threadItem must be a valid ObjectId',
			})
		)
		.optional()
		.allow(null),
})

export const messageUpdateSchema = Joi.object({
	text: Joi.string().min(1).max(500).required(),
	thread: Joi.array()
		.items(
			objectId.messages({
				'string.pattern.base': 'threadItem must be a valid ObjectId',
			})
		)
		.optional()
		.allow(null),
})

export const questionSchema = Joi.object({
	subjectId: objectId.required().messages({
		'any.required': 'subjectId Id is required',
		'string.pattern.base': 'subjectId Id must be a valid ObjectId',
	}),
	question: Joi.string().required(),
	type: Joi.string()
		.valid(...Object.values(QUESTION_TYPE))
		.default(QUESTION_TYPE.MULTIPLE_CHOICE)
		.optional()
		.allow(null),
	answers: Joi.array()
		.items(
			Joi.object({
				answer: Joi.string().required(),
				isCorrect: Joi.boolean().required(),
			})
		)
		.min(1)
		.required(),
	explanation: Joi.string().optional().allow(null, ''),
})

export const questionUpdateSchema = Joi.object({
	subjectId: objectId.optional().allow(null).messages({
		'string.pattern.base': 'subjectId must be a valid ObjectId',
	}),
	question: Joi.string().optional().allow(null),
	type: Joi.string()
		.valid(...Object.values(QUESTION_TYPE))
		.optional()
		.allow(null),
	answers: Joi.array()
		.items(
			Joi.object({
				id: objectId.optional().allow(null),
				answer: Joi.string().required(),
				isCorrect: Joi.boolean().required(),
			})
		)
		.min(1)
		.optional()
		.allow(null),
	explanation: Joi.string().optional().allow(null, ''),
})

export const quizSchema = Joi.object({
	subjectId: objectId.required().messages({
		'any.required': 'subjectId is required',
		'string.pattern.base': 'subjectId must be a valid ObjectId',
	}),
	title: Joi.string().min(2).max(50).required(),
	type: Joi.string()
		.valid(...Object.values(QUIZ_TYPE))
		.default(QUIZ_TYPE.EXAM)
		.required(),
	timeStart: Joi.date().optional().allow(null),
	timeLimit: Joi.number().integer().min(1).optional().allow(null),
	totalScore: Joi.number().integer().min(1).default(10).required(),
	passScore: Joi.number().integer().min(0).default(5).required(),
})

export const quizUpdateSchema = Joi.object({
	subjectId: objectId.optional().allow(null).messages({
		'string.pattern.base': 'subjectId must be a valid ObjectId',
	}),
	title: Joi.string().min(2).max(50).optional().allow(null),
	type: Joi.string()
		.valid(...Object.values(QUIZ_TYPE))
		.optional()
		.allow(null),
	timeStart: Joi.date().optional().allow(null),
	timeLimit: Joi.number().integer().min(1).optional().allow(null),
	totalScore: Joi.number().integer().min(1).optional().allow(null),
	passScore: Joi.number().integer().min(0).optional().allow(null),
})

export const quizQuestionSchema = Joi.object({
	questionId: objectId.required().messages({
		'any.required': 'questionId is required',
		'string.pattern.base': 'questionId must be a valid ObjectId',
	}),
})

export const bulkQuizQuestionSchema = Joi.object({
	questions: Joi.array()
		.items(
			Joi.object({
				subjectId: objectId.required().messages({
					'any.required': 'subjectId is required',
					'string.pattern.base': 'subjectId must be a valid ObjectId',
				}),
				question: Joi.string().min(1).required(),
				type: Joi.string().valid('multiple-choice', 'fill-in').required(),
				answers: Joi.array()
					.items(
						Joi.object({
							answer: Joi.string().required(),
							isCorrect: Joi.boolean().required(),
						})
					)
					.min(1)
					.required(),
				explanation: Joi.string().optional().allow(null, ''),
			})
		)
		.min(1)
		.required(),
})

export const resultSubmitSchema = Joi.object({
	quizId: objectId.required().messages({
		'any.required': 'quizId is required',
		'string.pattern.base': 'quizId must be a valid ObjectId',
	}),
	answers: Joi.array()
		.items(
			Joi.object({
				questionId: Joi.string().required(),
				answerId: Joi.string(),
				answerText: Joi.string(),
			}).or('answerId', 'answerText')
		)
		.required(),
})

// function input Schemas
export const loginSchema = Joi.object({
	email: Joi.string().trim().email().required(),
	password: Joi.string().min(6).max(20).allow('', null),
})

export const registerSchema = Joi.object({
	name: Joi.string().min(2).max(30).required(),
	email: Joi.string().trim().email().required(),
	password: Joi.string().min(6).max(20).required(),
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		'any.only': 'Confirm password must match password',
	}),
})

export const requestPasswordResetSchema = Joi.object({
	email: Joi.string().trim().email().required(),
})

export const verifyResetTokenSchema = Joi.object({
	token: Joi.string()
		.pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
		.required(),
})

export const changePasswordSchema = Joi.object({
	currentPassword: Joi.string().required(),
	password: Joi.string().min(6).max(20).required(),
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		'any.only': 'Confirm password must match password',
	}),
})

export const setPasswordSchema = Joi.object({
	password: Joi.string().min(6).max(20).required(),
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		'any.only': 'Confirm password must match password',
	}),
})

export const googleLoginSchema = Joi.object({
	googleId: Joi.string().required(),
	email: Joi.string().trim().email().required(),
	name: Joi.string().trim().required(),
	avatar: Joi.string().trim().required(),
})

export const facebookLoginSchema = Joi.object({
	facebookId: Joi.string().required(),
	email: Joi.string().trim().email().required(),
	name: Joi.string().trim().required(),
	avatar: Joi.string().trim().required(),
})

export const reorderSchema = Joi.object({
	orderList: Joi.array()
		.items(
			Joi.object({
				id: objectId.required().messages({
					'any.required': 'id is required',
					'string.pattern.base': 'id must be a valid ObjectId',
				}),
				order: Joi.number().integer().min(1).required(),
			})
		)
		.required()
		.custom((value, helpers) => {
			const orders = value.map((item) => item.order)
			const hasDuplicate = orders.length !== new Set(orders).size
			if (hasDuplicate) {
				return helpers.error('array.uniqueOrder')
			}
			return value
		}, 'Unique order validation'),
}).messages({ 'array.uniqueOrder': 'Each lesson must have a unique order value.' })
