import { LIMIT_QUERY_DEFAULT, POPULATE, QUIZ_TYPE } from '../constants/index.js'
import { applyPopulate, unflattenQueryObject } from '../utils/utils.js'
import { ConflictError, ForbiddenError } from '../utils/errors.js'

import Result, { convertResultToJSON } from '../models/Result.js'
import { convertUserToJSON } from '../models/User.js'
import ResultAnswer from '../models/ResultAnswer.js'

import * as quizService from './quizzes.js'

const RESULT_POPULATE = [POPULATE.USER, POPULATE.ANSWERS]

export const findQuizResults = async ({
	quizId,
	queryRequest,
	page = 1,
	limit = LIMIT_QUERY_DEFAULT,
}) => {
	const skip = (page - 1) * limit
	const parsedQuery = unflattenQueryObject(queryRequest)
	const matchConditions = [{ quiz: quizId }]

	if (parsedQuery.score) matchConditions.push({ score: parsedQuery.score })
	if (parsedQuery.totalScore) matchConditions.push({ totalScore: parsedQuery.totalScore })
	if (parsedQuery.startedAt?.startDate || parsedQuery.startedAt?.endDate) {
		const dateFilter = {}
		if (parsedQuery.startedAt.startDate) dateFilter.$gte = new Date(parsedQuery.startedAt.startDate)
		if (parsedQuery.startedAt.endDate) {
			const endDate = new Date(parsedQuery.startedAt.endDate)
			endDate.setDate(endDate.getDate() + 1)
			dateFilter.$lt = endDate
		}
		matchConditions.push({ startedAt: dateFilter })
	}
	if (parsedQuery.submittedAt?.startDate || parsedQuery.submittedAt?.endDate) {
		const dateFilter = {}
		if (parsedQuery.submittedAt.startDate)
			dateFilter.$gte = new Date(parsedQuery.submittedAt.startDate)
		if (parsedQuery.submittedAt.endDate) {
			const endDate = new Date(parsedQuery.submittedAt.endDate)
			endDate.setDate(endDate.getDate() + 1)
			dateFilter.$lt = endDate
		}
		matchConditions.push({ submittedAt: dateFilter })
	}
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

	const pipeline = [...basePipeline, { $sort: { _id: -1 } }, { $skip: skip }, { $limit: limit }]
	const results = await Result.aggregate(pipeline)

	const countPipeline = [...basePipeline, { $count: 'total' }]
	const countResult = await Result.aggregate(countPipeline)
	const total = countResult[0]?.total || 0

	const resultsWithImage = results.map((result) => ({
		...convertResultToJSON(result),
		createdBy: { ...convertUserToJSON(result.createdBy) },
	}))

	return { results: resultsWithImage, total }
}

export const findAllQuizResults = async (quizId, withDetails = true) => {
	const baseQuery = Result.find({ quiz: quizId }).sort({ _id: -1 })
	const populate = withDetails ? RESULT_POPULATE : POPULATE.USER
	const results = await applyPopulate(baseQuery, true, populate)
	const total = await Result.countDocuments(baseQuery)
	return { results, total }
}

export const findResultById = async (resultId, withDetails = true) => {
	const baseQuery = Result.findById(resultId)
	const result = await applyPopulate(baseQuery, withDetails, RESULT_POPULATE)
	return result
}

export const findResultByUserAndQuizId = async (userId, quizId, withDetails = false) => {
	const baseQuery = Result.findOne({ createdBy: userId, quiz: quizId })
	const result = await applyPopulate(baseQuery, withDetails, RESULT_POPULATE)
	return result
}

export const findResultsByUserId = async (userId, withDetails = false) => {
	const baseQuery = Result.find({ createdBy: userId }).sort({ _id: -1 })
	const results = await applyPopulate(baseQuery, withDetails, POPULATE.SUBJECT_QUIZ)
	const total = await Result.countDocuments(baseQuery)
	return { results, total }
}

export const createNewResult = async ({ quizId, userId, startedAt }) => {
	const existing = await Result.findOne({ quiz: quizId, createdBy: userId })
	if (existing) {
		existing.startedAt = new Date()
		await existing.save()
		return { result: existing, isNew: false }
	}

	const newResult = new Result({
		quiz: quizId,
		createdBy: userId,
		startedAt,
	})
	await newResult.save()
	return { result: newResult, isNew: true }
}

const buildResultAnswer = (submitted, question) => {
	const { answerId, answerText } = submitted
	let selectedAnswer = null
	let submittedAnswer = ''
	let isCorrect = false

	if (answerId && Array.isArray(question.answers)) {
		selectedAnswer = question.answers.find((a) => a.id.toString() === answerId)
		if (selectedAnswer?.isCorrect) {
			isCorrect = true
		}
	} else if (answerText) {
		submittedAnswer = answerText.trim()
		if (Array.isArray(question.answers)) {
			isCorrect = question.answers.some(
				(a) => a.answer.trim().toLowerCase() === submittedAnswer.toLowerCase() && a.isCorrect
			)
		}
	}

	return {
		answer: selectedAnswer?.id || null,
		answerText: submittedAnswer || '',
		isCorrect,
	}
}

const calculateScore = (correctCount, totalQuestions, totalScore) => {
	const safeTotal = totalQuestions === 0 ? 1 : totalQuestions
	const rawScore = (correctCount / safeTotal) * totalScore
	return Number(Math.ceil(rawScore * 100) / 100).toFixed(2)
}

export const submitResult = async (result, request) => {
	const { quiz, answers } = request
	const quizQuestions = quiz.quizQuestions

	if (result.submittedAt) {
		if (quiz.type === QUIZ_TYPE.EXAM)
			throw new ConflictError('Bài kiểm tra này đã được nộp và chấm điểm. Bạn không thể nộp lại..')
		if (quiz.type === QUIZ_TYPE.SURVEY)
			throw new ConflictError('Khảo sát đã hoàn tất. Mỗi người chỉ được gửi một lần.')
	}

	if (quiz.type === QUIZ_TYPE.EXAM && quiz.timeStart && quiz.timeLimit) {
		const startTime = new Date(quiz.timeStart)
		const endTime = new Date(startTime.getTime() + quiz.timeLimit * 60 * 1000)
		const now = new Date()

		if (now < startTime)
			throw new ForbiddenError('Chưa đến thời gian làm bài. Bạn không thể nộp kết quả.')
		if (now > endTime)
			throw new ForbiddenError('Đã quá thời gian làm bài. Bạn không thể nộp kết quả.')
	}

	const updates = {
		totalScore: quiz.totalScore,
		submittedAt: new Date(),
	}

	const resultAnswerDocs = []
	let resultMessage = ''
	let correctCount = 0
	let score = 0

	for (const submitted of answers) {
		const { questionId } = submitted

		if (!Array.isArray(quizQuestions)) continue
		const quizQuestion = quizQuestions.find((q) => q.question.id.toString() === questionId)
		if (!quizQuestion) continue

		const question = quizQuestion.question
		const answerDocs = buildResultAnswer(submitted, question)
		resultAnswerDocs.push({
			result: result.id,
			question: question.id,
			...answerDocs,
		})
		if (answerDocs.isCorrect) correctCount++
	}

	if (quiz.type === QUIZ_TYPE.SURVEY) {
		score = quiz.totalScore
		resultMessage = 'Cảm ơn bạn đã hoàn thành khảo sát!'
	} else {
		const totalQuestions =
			quiz.isRandom && quiz.randomCount > 0 ? quiz.randomCount : quizQuestions?.length ?? 0
		score = calculateScore(correctCount, totalQuestions, quiz.totalScore)
		resultMessage = `Bài kiểm tra đã được chấm điểm.\nĐiểm bài kiểm tra: ${score}/${quiz.totalScore}.\nBạn đã trả lời đúng ${correctCount} trong tổng số ${totalQuestions} câu hỏi.`
	}

	updates.score = score
	await Result.findByIdAndUpdate(result.id, { $set: updates }, { new: true })
	if (resultAnswerDocs.length) {
		await ResultAnswer.deleteMany({ result: result.id })
		await ResultAnswer.insertMany(resultAnswerDocs)
	}
	const completedResult = await findResultById(result.id, true)
	const completedQuiz = await quizService.findQuizById(quiz.id)
	return {
		result: completedResult,
		quiz: completedQuiz,
		message: resultMessage,
	}
}

export const deleteResult = async (result) => {
	return await result.deleteOne()
}

export const deleteUserResults = async (userId) => {
	const results = await Result.find({ createdBy: userId })
	const resultIds = results.map((m) => m.id)
	await Result.deleteMany({ _id: { $in: resultIds } })
	await ResultAnswer.deleteMany({ result: { $in: resultIds } })
}

export const deleteResultAnswers = async (resultId) => {
	await ResultAnswer.deleteMany({ result: resultId })
}
