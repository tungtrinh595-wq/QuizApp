import { faker } from '@faker-js/faker'
import slugify from 'slugify'

import { ROLE, QUESTION_TYPE, LESSON_STATUS, QUIZ_TYPE, POPULATE } from '../constants/index.js'
import User from '../models/User.js'
import Subject from '../models/Subject.js'
import Lesson from '../models/Lesson.js'
import LessonFile from '../models/LessonFile.js'
import Question from '../models/Question.js'
import Quiz from '../models/Quiz.js'
import QuizQuestion from '../models/QuizQuestion.js'
import Result from '../models/Result.js'
import Message from '../models/Message.js'
import Answer from '../models/Answer.js'
import ResultAnswer from '../models/ResultAnswer.js'
import Media from '../models/Media.js'

import * as userService from '../services/users.js'
import * as resultService from '../services/results.js'
import * as mediaService from '../services/medias.js'

export const clearDb = async () => {
	await Promise.all([
		User.deleteMany(),
		Subject.deleteMany(),
		Lesson.deleteMany(),
		LessonFile.deleteMany(),
		Question.deleteMany(),
		Quiz.deleteMany(),
		QuizQuestion.deleteMany(),
		Result.deleteMany(),
		ResultAnswer.deleteMany(),
		Message.deleteMany(),
		Answer.deleteMany(),
		Media.deleteMany(),
	])
	console.log('🗑 Database cleared successfully!')
}

const seedUser = async ({ name, email, role, slug }) => {
	const avatarUrl = faker.image.avatar() || `https://i.pravatar.cc/150?u=${email}`

	if (!slug) {
		const base = email?.split('@')[0]
		slug = slugify(base, { lower: true, strict: true })
	}

	return await userService.createNewUser({
		name,
		email,
		slug,
		role,
		password: '123456',
		bio: faker.lorem.sentences(2),
		file: { url: avatarUrl },
	})
}

export const seedDb = async () => {
	try {
		const existing = await Promise.all([
			User.estimatedDocumentCount(),
			Subject.estimatedDocumentCount(),
			Quiz.estimatedDocumentCount(),
		])

		if (existing.some((count) => count > 0)) {
			// console.log('⚠️ Database already has data. Skipping seeding...')
			return
		}

		// await clearDb()

		// USERS
		const admin = await seedUser({
			name: 'Admin',
			email: 'admin@email.com',
			role: ROLE.ADMIN,
			slug: 'admin',
		})
		const normalUser = await seedUser({
			name: 'User',
			email: 'user@email.com',
			role: ROLE.USER,
			slug: 'user',
		})
		const randomUsers = await Promise.all(
			[...Array(3)].map(() =>
				seedUser({
					name: faker.person.fullName(),
					email: faker.internet.email(),
					role: ROLE.USER,
				})
			)
		)
		const users = [admin, normalUser, ...randomUsers]
		const totalUsers = await User.countDocuments()
		console.log(`👥 Users: ${totalUsers}`)

		// SUBJECTS
		const subjects = await Promise.all(
			[...Array(2)].map(async () => {
				const title = faker.word.noun()
				const slug = slugify(title, { lower: true, strict: true })
				const image = await mediaService.saveMedia({
					url: `https://picsum.photos/seed/${faker.string.uuid()}/640/480`,
				})
				const description = faker.lorem.sentence()

				return new Subject({
					title,
					slug,
					image,
					description,
					createdBy: admin.id,
				}).save()
			})
		)
		const totalSubjects = await Subject.countDocuments()
		console.log(`📚 Subjects: ${totalSubjects}`)

		// LESSONS
		const lessons = await Promise.all(
			subjects.flatMap((subject) =>
				[...Array(3)].map(async (_, i) => {
					const title = faker.lorem.words(3)
					const slug = slugify(title, { lower: true, strict: true })
					const lessonImage = await mediaService.saveMedia({
						url: `https://picsum.photos/seed/${faker.string.uuid()}/640/480`,
					})

					return new Lesson({
						subject: subject.id,
						title,
						slug,
						image: lessonImage,
						description: faker.lorem.sentences(2),
						content: faker.lorem.paragraphs(2),
						status: LESSON_STATUS.PUBLISHED,
						order: i + 1,
						createdBy: admin.id,
					}).save()
				})
			)
		)
		const totalLessons = await Lesson.countDocuments()
		console.log(`📘 Lessons: ${totalLessons}`)

		// QUESTIONS + ANSWERS
		const questions = await Promise.all(
			subjects.flatMap((subject) =>
				[...Array(10)].map(() =>
					new Question({
						subject: subject._id,
						question: faker.lorem.sentence(),
						type: faker.helpers.arrayElement([
							QUESTION_TYPE.MULTIPLE_CHOICE,
							QUESTION_TYPE.FILL_IN,
						]),
						explanation: faker.lorem.sentence(),
						createdBy: admin._id,
					}).save()
				)
			)
		)
		const totalQuestions = await Question.countDocuments()
		console.log(`❓ Questions: ${totalQuestions}`)

		await Promise.all(
			questions.flatMap((question) =>
				[...Array(4)].map((_, i) =>
					new Answer({
						question: question._id,
						answer: faker.lorem.word(),
						isCorrect: i === 0,
					}).save()
				)
			)
		)
		const totalAnswers = await Answer.countDocuments()
		console.log(`☑️ Answers: ${totalAnswers}`)

		// QUIZZES + QUIZ QUESTIONS
		const quizzes = await Promise.all(
			subjects.flatMap((subject) =>
				[QUIZ_TYPE.EXAM, QUIZ_TYPE.PRACTICE, QUIZ_TYPE.SURVEY].map(async (type) => {
					const title = `${subject.title} ${type}`
					const slug = slugify(title, { lower: true, strict: true })
					const quizImage = await mediaService.saveMedia({
						url: `https://picsum.photos/seed/${faker.string.uuid()}/640/480`,
					})

					return new Quiz({
						subject: subject.id,
						title,
						slug,
						image: quizImage,
						description: faker.lorem.sentence(),
						type,
						totalScore: 10,
						passScore: 5,
						isRandom: false,
						randomCount: 0,
						createdBy: admin.id,
					}).save()
				})
			)
		)
		const totalQuizzes = await Quiz.countDocuments()
		console.log(`⏳ Quizzes: ${totalQuizzes}`)

		await Promise.all(
			quizzes.map(async (quiz) => {
				if (!quiz.subject) {
					console.warn(`Quiz ${quiz.title} has no subject`)
					return
				}

				const relatedQuestions = questions.filter(
					(q) => q.subject?.toString() === quiz.subject.toString()
				)

				if (relatedQuestions.length < 5) {
					console.warn(`Not enough questions for quiz ${quiz.title}`)
					return
				}

				const selectedQuestions = faker.helpers.shuffle(relatedQuestions).slice(0, 5)

				await Promise.all(
					selectedQuestions.map((question, index) =>
						new QuizQuestion({
							quiz: quiz._id,
							question: question._id,
							order: index + 1,
						}).save()
					)
				)
			})
		)
		const totalQuizQuestions = await QuizQuestion.countDocuments()
		console.log(`📝 QuizQuestions: ${totalQuizQuestions}`)

		// RESULTS + RESULT ANSWERS via submitResult
		const normalUsers = users.filter((u) => u.role === ROLE.USER)
		await Promise.all(
			quizzes.flatMap((quiz) =>
				normalUsers.map(async (user) => {
					const { result } = await resultService.createNewResult({
						quizId: quiz._id,
						userId: user._id,
						startedAt: faker.date.recent(),
					})

					const quizDetails = await Quiz.findById(quiz._id).populate([
						{
							path: 'quizQuestions',
							populate: { path: 'question', populate: { path: 'answers' } },
						},
						POPULATE.SUBJECT,
						POPULATE.IMAGE,
						POPULATE.USER,
					])

					const quizQuestions = quizDetails.quizQuestions
					const answers = await Promise.all(
						quizQuestions.map(async (qq) => {
							const question = qq.question
							const answerList = await Answer.find({ question: question._id })

							if (question.type === QUESTION_TYPE.MULTIPLE_CHOICE && answerList.length > 0) {
								const selected = faker.helpers.arrayElement(answerList)
								return {
									questionId: question._id.toString(),
									answerId: selected._id.toString(),
								}
							} else {
								const correct = answerList.find((a) => a.isCorrect)
								const fakeInput = faker.lorem.word()
								const input =
									faker.datatype.boolean() && correct?.answer ? correct.answer : fakeInput
								return {
									questionId: question._id.toString(),
									answerText: input,
								}
							}
						})
					)

					if (quizQuestions?.length > 0 && result instanceof Result) {
						const resultDetails = await Result.findById(result._id).populate([
							POPULATE.USER,
							POPULATE.ANSWERS,
						])
						await resultService.submitResult(resultDetails, {
							quiz: quizDetails,
							questions: quizQuestions,
							answers,
						})
					}
				})
			)
		)
		const totalResults = await Result.countDocuments()
		console.log(`🎯 Results: ${totalResults}`)

		const totalResultAnswers = await ResultAnswer.countDocuments()
		console.log(`🧮 ResultAnswers: ${totalResultAnswers}`)

		// MESSAGES
		await Promise.all(
			lessons.map(async (lesson) => {
				const root = await new Message({
					text: faker.lorem.sentences(2),
					createdBy: faker.helpers.arrayElement(users).id,
					lesson: lesson.id,
				}).save()

				const reply1 = await new Message({
					text: faker.lorem.sentences(2),
					createdBy: faker.helpers.arrayElement(users).id,
					lesson: lesson.id,
					parentMessage: root._id,
				}).save()

				await new Message({
					text: faker.lorem.sentences(2),
					createdBy: faker.helpers.arrayElement(users).id,
					lesson: lesson.id,
					parentMessage: reply1._id,
				}).save()
			})
		)
		const totalMessages = await Message.countDocuments()
		console.log(`💬 Messages: ${totalMessages}`)

		console.log('✅ Database seeded successfully!')
	} catch (err) {
		console.error('❌ Error while seeding database:', err)
	}
}
