import slugify from 'slugify'

import { LIMIT_QUERY_DEFAULT, POPULATE, QUIZ_TYPE } from '../constants/index.js'
import Quiz, { convertQuizToJSON } from '../models/Quiz.js'
import QuizQuestion from '../models/QuizQuestion.js'
import { convertUserToJSON } from '../models/User.js'
import Subject, { convertSubjectToJSON } from '../models/Subject.js'

import * as resultService from './results.js'
import * as questionService from './questions.js'
import * as subjectServices from './subjects.js'

import {
	applyPopulate,
	deleteMediaFile,
	generateUniqueSlug,
	unflattenQueryObject,
} from '../utils/utils.js'
import { ConflictError, NotFoundError } from '../utils/errors.js'
import { saveMedia } from './medias.js'

const getQuizPopulate = (withCorrectAnswers = true) => {
	return [
		{
			path: 'quizQuestions',
			populate: {
				path: 'question',
				select: !withCorrectAnswers ? '-explanation' : undefined,
				populate: {
					path: 'answers',
					select: !withCorrectAnswers ? '-isCorrect' : undefined,
				},
			},
		},
		POPULATE.SUBJECT,
		POPULATE.IMAGE,
		POPULATE.USER,
	]
}
const getQuizQuestionPopulate = (withCorrectAnswers = true) => {
	return [
		POPULATE.QUIZ,
		{
			path: 'question',
			select: !withCorrectAnswers ? '-explanation' : undefined,
			populate: {
				path: 'answers',
				select: !withCorrectAnswers ? '-isCorrect' : undefined,
			},
		},
	]
}

export const findQuizzes = async ({ queryRequest, page = 1, limit = LIMIT_QUERY_DEFAULT }) => {
	const skip = (page - 1) * limit
	const parsedQuery = unflattenQueryObject(queryRequest)
	const matchConditions = []

	if (parsedQuery.title)
		matchConditions.push({ title: { $regex: escapeRegex(parsedQuery.title), $options: 'i' } })
	if (parsedQuery.description)
		matchConditions.push({
			description: { $regex: escapeRegex(parsedQuery.description), $options: 'i' },
		})
	if (parsedQuery.type) matchConditions.push({ type: parsedQuery.type })
	if (parsedQuery.timeStart?.startDate || parsedQuery.timeStart?.endDate) {
		const dateFilter = {}
		if (parsedQuery.timeStart.startDate) dateFilter.$gte = new Date(parsedQuery.timeStart.startDate)
		if (parsedQuery.timeStart.endDate) {
			const endDate = new Date(parsedQuery.createdAt.endDate)
			endDate.setDate(endDate.getDate() + 1)
			dateFilter.$lt = endDate
		}
		matchConditions.push({ timeStart: dateFilter })
	}
	if (parsedQuery.timeLimit) matchConditions.push({ timeLimit: parsedQuery.timeLimit })
	if (parsedQuery.totalScore) matchConditions.push({ totalScore: parsedQuery.totalScore })
	if (parsedQuery.passScore) matchConditions.push({ passScore: parsedQuery.passScore })
	if (parsedQuery.createdAt?.startDate || parsedQuery.createdAt?.endDate) {
		const dateFilter = {}
		if (parsedQuery.createdAt.startDate) dateFilter.$gte = new Date(parsedQuery.createdAt.startDate)
		if (parsedQuery.createdAt.endDate) {
			const endDate = new Date(parsedQuery.createdAt.endDate)
			endDate.setDate(endDate.getDate() + 1)
			dateFilter.$lt = endDate
		}
		matchConditions.push({ createdAt: dateFilter })
	}

	const match = matchConditions.length > 0 ? { $and: matchConditions } : {}

	const basePipeline = [
		{ $match: match },
		{
			$lookup: {
				from: 'users',
				localField: 'createdBy',
				foreignField: '_id',
				as: 'createdBy',
			},
		},
		{ $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
		{
			$lookup: {
				from: 'media',
				localField: 'createdBy.avatar',
				foreignField: '_id',
				as: 'avatarDoc',
			},
		},
		{
			$set: {
				'createdBy.avatar': { $arrayElemAt: ['$avatarDoc', 0] },
			},
		},
		{
			$lookup: {
				from: 'subjects',
				localField: 'subject',
				foreignField: '_id',
				as: 'subject',
			},
		},
		{ $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
	]

	if (parsedQuery.createdBy) {
		basePipeline.push({
			$match: {
				$or: [
					{ 'createdBy.name': { $regex: parsedQuery.createdBy, $options: 'i' } },
					{ 'createdBy.email': { $regex: parsedQuery.createdBy, $options: 'i' } },
				],
			},
		})
	}

	if (parsedQuery.subject) {
		basePipeline.push({
			$match: { 'subject.title': { $regex: parsedQuery.subject, $options: 'i' } },
		})
	}

	const pipeline = [...basePipeline, { $sort: { _id: -1 } }, { $skip: skip }, { $limit: limit }]
	const quizzes = await Quiz.aggregate(pipeline)

	const countPipeline = [...basePipeline, { $count: 'total' }]
	const countResult = await Quiz.aggregate(countPipeline)
	const total = countResult[0]?.total || 0

	const quizzessWithImage = quizzes.map((quiz) => ({
		...convertQuizToJSON(quiz),
		createdBy: { ...convertUserToJSON(quiz.createdBy) },
		subject: { ...convertSubjectToJSON(quiz.subject) },
	}))

	return { quizzes: quizzessWithImage, total }
}

export const findAllQuizzes = async () => {
	const baseQuery = Quiz.find().sort({ _id: -1 })
	const quizPopulate = getQuizPopulate()
	const quizzes = await applyPopulate(baseQuery, true, quizPopulate)
	const total = await Quiz.countDocuments(baseQuery)
	return { quizzes, total }
}

export const findSubjectQuizzes = async ({
	subjectId,
	page = 1,
	limit = LIMIT_QUERY_DEFAULT,
	queryTotal,
}) => {
	const query = { subject: subjectId }
	const skip = (page - 1) * limit
	const quizzes = await Quiz.find(query).sort({ _id: -1 }).skip(skip).limit(limit)
	const total = queryTotal ?? (await Quiz.countDocuments(query))
	return { quizzes, total }
}

export const findQuizById = async (quizId, withDetails = true, withCorrectAnswers = true) => {
	const baseQuery = Quiz.findById(quizId)
	const quizPopulate = getQuizPopulate(withCorrectAnswers)
	return await applyPopulate(baseQuery, withDetails, quizPopulate)
}

export const findQuizBySlug = async (slug, withDetails = true, withCorrectAnswers = true) => {
	const baseQuery = Quiz.findOne({ slug })
	const quizPopulate = getQuizPopulate(withCorrectAnswers)
	const quiz = await applyPopulate(baseQuery, withDetails, quizPopulate)
	return quiz
}

export const findListQuizQuestions = async (quizQuestionIds) => {
	if (!Array.isArray(quizQuestionIds) || quizQuestionIds.length === 0) return []
	const baseQuery = QuizQuestion.find({ _id: { $in: quizQuestionIds } })
	const quizQuestionPopulate = getQuizQuestionPopulate()
	const quizQuestions = await applyPopulate(baseQuery, true, quizQuestionPopulate)
	return quizQuestions
}

export const createNewQuiz = async (request) => {
	const {
		title,
		slug,
		description,
		type,
		totalScore,
		passScore,
		questions,
		timeStart,
		timeLimit,
		user,
		subject,
		file,
	} = request

	let subjectSlug = subject?.slug
	if (!subjectSlug && typeof subject === 'string') {
		const subjectDoc = await Subject.findById(subject)
		subjectSlug = subjectDoc?.slug || 'unknown'
	}
	const finalSlug = await generateUniqueSlug(`${subjectSlug}-${slug}`, Quiz)
	const newQuizPayload = {
		title,
		slug: finalSlug,
		description,
		type,
		totalScore,
		passScore,
		createdBy: user.id,
		subject: subject.id,
	}
	if (timeStart) newQuizPayload.timeStart = timeStart
	if (timeLimit) newQuizPayload.timeLimit = timeLimit
	if (file?.url) {
		const media = await saveMedia(file)
		newQuizPayload.image = media
	}

	const newQuiz = new Quiz(newQuizPayload)
	await newQuiz.save()

	if (Array.isArray(questions) && questions.length > 0) {
		await Promise.all(
			questions.map((question, index) =>
				new QuizQuestion({
					quiz: newQuiz.id,
					question: question.id,
					order: index + 1,
				}).save()
			)
		)
	}

	const quizPopulate = getQuizPopulate()
	return await newQuiz.populate(quizPopulate)
}

export const updateQuiz = async (quiz, request) => {
	const quizId = quiz.id
	const updates = {}
	let oldImage = ''

	if (request.subject?.id) updates.subject = request.subject.id
	const updatedFields = [
		'title',
		'description',
		'type',
		'timeStart',
		'timeLimit',
		'totalScore',
		'passScore',
		'isRandom',
		'randomCount',
	]
	updatedFields.forEach((key) => {
		if (key in request) updates[key] = request[key]
	})
	if ('slug' in request) {
		const exists = await Quiz.exists({ slug: request.slug, _id: { $ne: quizId } })
		if (exists) throw new ConflictError('Slug already taken.')
		updates.slug = request.slug
	} else if ('title' in request || 'subject' in request) {
		const baseTitle = request.title || quiz.title || 'quiz'
		const baseQuizSlug = slugify(baseTitle, { lower: true, strict: true })

		let subjectSlug = request.subject?.slug
		if (!subjectSlug) {
			let subject = quiz.subject
			if (typeof subject === 'string') subject = await Subject.findById(subject)
			subjectSlug = subject?.slug
		}

		const baseSlug = subjectSlug ? `${subjectSlug}-${baseQuizSlug}` : baseQuizSlug
		updates.slug = await generateUniqueSlug(baseSlug, Quiz, quiz.slug)
	}
	if (request.file?.url) {
		oldImage = quiz.image
		const media = await saveMedia(request.file)
		updates.image = media
	}
	if (Array.isArray(request.questions) && request.questions.length > 0) {
		await QuizQuestion.deleteMany({ quiz: quizId })
		await Promise.all(
			request.questions.map((question, index) =>
				new QuizQuestion({
					quiz: quizId,
					question: question.id,
					order: index + 1,
				}).save()
			)
		)
	}

	const quizPopulate = getQuizPopulate()
	const quizUpdated = await Quiz.findByIdAndUpdate(
		quizId,
		{ $set: updates },
		{ new: true }
	).populate(quizPopulate)

	if (oldImage) await deleteMediaFile(oldImage)
	return quizUpdated
}

export const addQuestionToQuiz = async (request) => {
	const { quiz, question } = request
	const quizQuestionPopulate = getQuizQuestionPopulate()
	const existsQuizQuestion = await QuizQuestion.findOne({
		quiz: quiz.id,
		question: question.id,
	}).populate(quizQuestionPopulate)
	if (existsQuizQuestion) return existsQuizQuestion

	const count = await QuizQuestion.countDocuments({ quiz: quiz.id })
	const quizQuestion = new QuizQuestion({
		quiz: quiz.id,
		question: question.id,
		order: count + 1,
	})
	await quizQuestion.save()
	return await quizQuestion.populate(quizQuestionPopulate)
}

export const bulkAddQuizQuestions = async ({ quiz, questions, user }) => {
	const quizQuestions = []

	const foundSubejct = questions[0]?.subjectId
		? await subjectServices.findSubjectById(questions[0]?.subjectId)
		: null

	if (!foundSubejct) throw new NotFoundError('Không tìm thấy môn học')
	const subject = foundSubejct.toJSON()

	for (const item of questions) {
		const createdQuestion = await questionService.createNewQuestion({
			question: item.question,
			type: item.type,
			answers: item.answers,
			explanation: item.explanation,
			user,
			subject,
		})
		const quizQuestion = await addQuestionToQuiz({
			quiz,
			question: createdQuestion,
		})
		quizQuestions.push(quizQuestion)
	}
	return quizQuestions
}

export const updateQuizQuestionsOrder = async (request) => {
	const { orderList } = request
	const operations = orderList.map((qq) => ({
		updateOne: {
			filter: { _id: qq.id },
			update: { $set: { order: qq.order } },
		},
	}))
	await QuizQuestion.bulkWrite(operations)

	const quizQuestionPopulate = getQuizQuestionPopulate()
	return await QuizQuestion.find({ _id: { $in: orderList.map((l) => l.id) } })
		.sort({ order: 1 })
		.populate(quizQuestionPopulate)
}

export const deleteQuiz = async (quiz) => {
	return await quiz.deleteOne()
}

export const removeQuestionFromQuiz = async ({ quiz, question }) => {
	return await QuizQuestion.deleteOne({ quiz: quiz.id, question: question.id })
}

export const publicQuiz = async ({ quiz, user }) => {
	const now = new Date()
	if (quiz.type === QUIZ_TYPE.EXAM && quiz.timeStart) {
		if (now < quiz.timeStart) return { isPublished: false, message: 'Kỳ thi chưa mở.' }
		if (quiz.timeLimit && now > new Date(quiz.timeStart.getTime() + quiz.timeLimit * 60000))
			return { isPublished: false, message: 'Kỳ thi đã kết thúc.' }
	}

	const { result, isNew } = await resultService.createNewResult({
		quizId: quiz.id,
		userId: user.id,
		startedAt: now,
	})

	if (result.submittedAt) {
		if (quiz.type === QUIZ_TYPE.EXAM)
			throw new ConflictError('Bài kiểm tra này đã được nộp và chấm điểm. Bạn không thể nộp lại..')
		if (quiz.type === QUIZ_TYPE.SURVEY)
			throw new ConflictError('Khảo sát đã hoàn tất. Mỗi người chỉ được gửi một lần.')
	}

	const resQuiz = isNew ? quiz : await findQuizById(quiz.id)
	return { isPublished: true, quiz: resQuiz, result, message: 'Kỳ thi đã bắt đầu.' }
}
