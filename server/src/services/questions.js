import Question from '../models/Question.js'
import Answer from '../models/Answer.js'
import { applyPopulate } from '../utils/utils.js'
import agenda from '../../jobs/agenda.js'

const getQuestionPopulate = (withCorrectAnswers = true) => {
	return [
		{
			path: 'answers',
			select: !withCorrectAnswers ? '-isCorrect' : undefined,
		},
	]
}

export const findSubjectQuestions = async (subjectId, withCorrectAnswers = true) => {
	let baseQuery = Question.find({ subject: subjectId }).sort({ _id: -1 })
	if (!withCorrectAnswers) baseQuery = baseQuery.select('-explanation')
	const questionPopulate = getQuestionPopulate(withCorrectAnswers)
	const questions = await applyPopulate(baseQuery, true, questionPopulate)
	const total = await Question.countDocuments(baseQuery)
	return { questions, total }
}

export const findQuestionById = async (
	questionId,
	withDetails = true,
	withCorrectAnswers = true
) => {
	let baseQuery = Question.findById(questionId)
	if (!withCorrectAnswers) baseQuery = baseQuery.select('-explanation')
	const questionPopulate = getQuestionPopulate(withCorrectAnswers)
	const question = await applyPopulate(baseQuery, withDetails, questionPopulate)
	return question
}

export const findListQuestions = async (questionIds, withDetails = false) => {
	if (!Array.isArray(questionIds) || questionIds.length === 0) return []
	const baseQuery = Question.find({ _id: { $in: questionIds } })
	const questions = await applyPopulate(baseQuery, withDetails, 'answers')
	return questions
}

export const createNewQuestion = async (request) => {
	const { question, type, answers, explanation, user, subject } = request

	const existingQuestions = await Question.find({
		question,
		type,
		subject: subject.id || subject,
	})

	for (const existing of existingQuestions) {
		const existingAnswers = await Answer.find({ question: existing._id }).lean()

		const isSameLength = existingAnswers.length === answers.length
		const isSameContent =
			isSameLength &&
			answers.every((a) =>
				existingAnswers.some((ea) => ea.answer === a.answer && ea.isCorrect === a.isCorrect)
			)

		if (isSameContent) {
			const questionPopulate = getQuestionPopulate()
			await existing.populate(questionPopulate)
			return existing
		}
	}

	const newQuestionPayload = {
		question,
		type,
		explanation: explanation || '',
		createdBy: user.id,
		subject: subject.id,
	}
	const newQuestion = new Question(newQuestionPayload)
	await newQuestion.save()

	const newAnswers = answers.map((item) => ({
		question: newQuestion.id,
		answer: item.answer,
		isCorrect: item.isCorrect,
	}))
	await Answer.insertMany(newAnswers)

	const questionPopulate = getQuestionPopulate()
	await newQuestion.populate(questionPopulate)
	return newQuestion
}

export const updateQuestion = async (questionId, request) => {
	const { subject, foundQuestion, answers: newAnswers } = request
	let isPreserveQuestion = false
	const updates = {}

	if (subject?.id) {
		updates.subject = subject.id
		if (String(foundQuestion.subject) !== String(subject.id)) isPreserveQuestion = true
	}

	;['question', 'type', 'explanation'].forEach((key) => {
		if (key in request && foundQuestion[key] !== request[key]) {
			isPreserveQuestion = true
			updates[key] = request[key]
		}
	})

	if (Array.isArray(newAnswers)) {
		const oldAnswers = foundQuestion.answers || []
		const addAnswers = newAnswers
			.filter((item) => !item.id)
			.map((item) => ({
				question: questionId,
				answer: item.answer,
				isCorrect: item.isCorrect,
			}))
		const updateAnswers = newAnswers.filter((newItem) =>
			oldAnswers.some((oldItem) => oldItem.id === newItem.id)
		)
		const deleteAnswers = oldAnswers.filter(
			(oldItem) => !newAnswers.some((newItem) => newItem.id === oldItem.id)
		)
		const deleteAnswerIds = deleteAnswers.map((item) => item.id)

		if (addAnswers.length) await Answer.insertMany(addAnswers)
		await Promise.all(
			updateAnswers.map(async (item) => {
				const oldAnswer = oldAnswers.find((a) => a.id === item.id)
				if (oldAnswer.answer !== item.answer) isPreserveQuestion = true

				await Answer.findByIdAndUpdate(item.id, {
					answer: item.answer,
					isCorrect: item.isCorrect,
				})
			})
		)
		if (deleteAnswerIds.length > 0) {
			isPreserveQuestion = true
			await Answer.deleteMany({ _id: { $in: deleteAnswerIds } })
		}
	}

	if (isPreserveQuestion && foundQuestion.id)
		agenda.now('preserveQuestionSnapshot', { question: foundQuestion.toObject() })

	delete updates.answers
	const questionPopulate = getQuestionPopulate()
	return await Question.findByIdAndUpdate(questionId, { $set: updates }, { new: true }).populate(
		questionPopulate
	)
}

export const deleteQuestion = async (question) => {
	agenda.now('preserveQuestionSnapshot', { question: question.toObject() })
	return await question.deleteOne()
}
