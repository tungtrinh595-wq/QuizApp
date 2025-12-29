import slugify from 'slugify'

import { LESSON_STATUS, LIMIT_QUERY_DEFAULT, POPULATE } from '../constants/index.js'
import { convertUserToJSON } from '../models/User.js'
import Subject, { convertSubjectToJSON } from '../models/Subject.js'
import Lesson, { convertLessonToJSON } from '../models/Lesson.js'
import {
	applyPopulate,
	deleteMediaFile,
	escapeRegex,
	generateUniqueSlug,
	unflattenQueryObject,
} from '../utils/utils.js'
import * as mediaService from './medias.js'

const LESSON_POPULATE_WITH_FILES = [
	POPULATE.IMAGE,
	POPULATE.SUBJECT,
	POPULATE.LESSON_FILE,
	POPULATE.USER,
]
const LESSON_POPULATE = [POPULATE.IMAGE, POPULATE.SUBJECT, POPULATE.USER]

export const findLessonByCursor = async ({ cursor, limit = LIMIT_QUERY_DEFAULT }) => {
	const query = cursor ? { _id: { $lt: cursor } } : {}
	const lessons = await Lesson.find(query).select('-content').sort({ _id: -1 }).limit(limit)
	return lessons
}

export const findPublishedLessonByCursor = async ({ cursor, limit = LIMIT_QUERY_DEFAULT }) => {
	const query = cursor
		? { status: LESSON_STATUS.PUBLISHED, _id: { $lt: cursor } }
		: { status: LESSON_STATUS.PUBLISHED }
	const lessons = await Lesson.find(query).select('-content').sort({ _id: -1 }).limit(limit)
	return lessons
}

export const findLessonById = async (lessonId, withDetails = false, onlyPublic = false) => {
	const matchConditions = { _id: lessonId }
	if (onlyPublic) matchConditions.status = LESSON_STATUS.PUBLISHED
	const baseQuery = Lesson.findOne(matchConditions)
	const lesson = await applyPopulate(baseQuery, withDetails, LESSON_POPULATE_WITH_FILES)
	return lesson
}

export const findLessonBySlug = async (slug, withDetails = false, onlyPublic = false) => {
	const matchConditions = { slug }
	if (onlyPublic) matchConditions.status = LESSON_STATUS.PUBLISHED
	const baseQuery = Lesson.findOne(matchConditions)
	const lesson = await applyPopulate(baseQuery, withDetails, LESSON_POPULATE_WITH_FILES)
	return lesson
}

export const findLessons = async ({
	queryRequest,
	page = 1,
	limit = LIMIT_QUERY_DEFAULT,
	onlyPublic = false,
}) => {
	const skip = (page - 1) * limit
	const parsedQuery = unflattenQueryObject(queryRequest)
	const matchConditions = []

	if (onlyPublic) matchConditions.push({ status: LESSON_STATUS.PUBLISHED })
	if (parsedQuery.title)
		matchConditions.push({ title: { $regex: escapeRegex(parsedQuery.title), $options: 'i' } })
	if (parsedQuery.description)
		matchConditions.push({
			description: { $regex: escapeRegex(parsedQuery.description), $options: 'i' },
		})
	if (parsedQuery.content)
		matchConditions.push({ content: { $regex: escapeRegex(parsedQuery.content), $options: 'i' } })
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
	const lessons = await Lesson.aggregate(pipeline)

	const countPipeline = [...basePipeline, { $count: 'total' }]
	const countResult = await Lesson.aggregate(countPipeline)
	const total = countResult[0]?.total || 0

	const lessonsWithImage = lessons.map((lesson) => ({
		...convertLessonToJSON(lesson),
		createdBy: { ...convertUserToJSON(lesson.createdBy) },
		subject: { ...convertSubjectToJSON(lesson.subject) },
	}))

	return { lessons: lessonsWithImage, total }
}

export const findAllLessons = async () => {
	const baseQuery = Lesson.find().sort({ _id: -1 })
	const lessons = await applyPopulate(baseQuery, true, LESSON_POPULATE_WITH_FILES)
	const total = await Lesson.countDocuments(baseQuery)
	return { lessons, total }
}

export const findSubjectLessonsByCursor = async ({
	subjectId,
	cursor,
	limit = LIMIT_QUERY_DEFAULT,
}) => {
	const query = cursor ? { subject: subjectId, _id: { $lt: cursor } } : { subject: subjectId }
	const lessons = await Lesson.find(query).select('-content').sort({ order: -1 }).limit(limit)
	return lessons
}

export const findSubjectLessons = async ({ subjectId }) => {
	const baseQuery = Lesson.find({ subject: subjectId }).sort({ order: -1 }).select('-content')
	const lessons = await applyPopulate(baseQuery, true, LESSON_POPULATE)
	return lessons
}

export const findListLessons = async (lessonIds, withDetails = false) => {
	if (!Array.isArray(lessonIds) || lessonIds.length === 0) return []
	const baseQuery = Lesson.find({ _id: { $in: lessonIds } })
	const lessons = await applyPopulate(baseQuery, withDetails, LESSON_POPULATE_WITH_FILES)
	return lessons
}

export const createNewLesson = async (request) => {
	const { user, title, slug, description, content, status, subject, file } = request

	let subjectSlug = subject?.slug
	if (!subjectSlug && typeof subject === 'string') {
		const subjectDoc = await Subject.findById(subject)
		subjectSlug = subjectDoc?.slug || 'unknown'
	}
	const finalSlug = await generateUniqueSlug(`${subjectSlug}-${slug}`, Lesson)
	const subjectId = typeof subject === 'string' ? subject : subject._id
	const total = await Lesson.countDocuments({ subject: subjectId })
	const order = total + 1

	const newLessonPayload = {
		title,
		slug: finalSlug,
		description,
		content,
		status,
		subject,
		order,
		createdBy: user.id,
	}
	if (file?.url) {
		const media = await mediaService.saveMedia(file)
		newLessonPayload.image = media
	}

	const newLesson = new Lesson(newLessonPayload)
	await newLesson.save()
	return await newLesson.populate(LESSON_POPULATE)
}

export const updateLesson = async (lesson, request) => {
	const lessonId = lesson.id
	const updates = {}
	let oldImage = ''

	if (request.subject?.id) updates.subject = request.subject.id
	;['title', 'description', 'content', 'status', 'order'].forEach((key) => {
		if (key in request) updates[key] = request[key]
	})
	if ('slug' in request) {
		const exists = await Lesson.exists({ slug: request.slug, _id: { $ne: lessonId } })
		if (exists) throw new ConflictError('Slug already taken.')
		updates.slug = request.slug
	} else if ('title' in request || 'subject' in request) {
		const baseTitle = request.title || lesson.title
		const baseLessonSlug = slugify(baseTitle, { lower: true, strict: true })

		let subjectSlug = request.subject?.slug
		if (!subjectSlug) {
			let subject = lesson.subject
			if (typeof subject === 'string') subject = await Subject.findById(subject)
			subjectSlug = subject?.slug
		}

		const baseSlug = subjectSlug ? `${subjectSlug}-${baseLessonSlug}` : baseLessonSlug
		updates.slug = await generateUniqueSlug(baseSlug, Lesson, lesson.slug)
	}
	if (request.file?.url) {
		oldImage = lesson.image
		const media = await mediaService.saveMedia(request.file)
		updates.image = media
	}

	const updatedLesson = await Lesson.findByIdAndUpdate(
		lessonId,
		{ $set: updates },
		{ new: true }
	).populate(LESSON_POPULATE)

	if (oldImage) await deleteMediaFile(oldImage)
	return updatedLesson
}

export const updateLessonOrder = async (request) => {
	const { orderList } = request
	const operations = orderList.map((l) => ({
		updateOne: {
			filter: { _id: l.id },
			update: { $set: { order: l.order } },
		},
	}))
	await Lesson.bulkWrite(operations)

	const updatedLessons = await Lesson.find({ _id: { $in: orderList.map((l) => l.id) } }).sort({
		order: 1,
	})
	return updatedLessons.map((l) => l.toJSON())
}

export const deleteLesson = async (lesson) => {
	return await lesson.deleteOne()
}
