import slugify from 'slugify'

import { LIMIT_QUERY_DEFAULT, POPULATE } from '../constants/index.js'
import {
	applyPopulate,
	deleteMediaFile,
	escapeRegex,
	unflattenQueryObject,
} from '../utils/utils.js'
import { ConflictError } from '../utils/errors.js'

import Subject, { convertSubjectToJSON } from '../models/Subject.js'
import { convertUserToJSON } from '../models/User.js'

import * as mediaService from './medias.js'

const SUBJECT_POPULATE = [POPULATE.IMAGE, POPULATE.SIMPLE_LESSONS, POPULATE.QUIZZES, POPULATE.USER]

export const findSubjectById = async (subjectId, withDetails = false) => {
	const baseQuery = Subject.findById(subjectId)
	const subject = await applyPopulate(baseQuery, withDetails, SUBJECT_POPULATE)
	return subject
}

export const findSubjectBySlug = async (slug, withDetails = false) => {
	const baseQuery = Subject.findOne({ slug })
	const subject = await applyPopulate(baseQuery, withDetails, SUBJECT_POPULATE)
	return subject
}

export const findSubjectsByCursor = async ({ cursor, limit = LIMIT_QUERY_DEFAULT }) => {
	const query = cursor ? { isActive: true, _id: { $lt: cursor } } : { isActive: true }
	return await Subject.find(query).sort({ _id: -1 }).limit(limit)
}

export const findSubjects = async ({ queryRequest, page = 1, limit = LIMIT_QUERY_DEFAULT }) => {
	const skip = (page - 1) * limit
	const parsedQuery = unflattenQueryObject(queryRequest)
	const matchConditions = [{ isActive: true }]

	if (parsedQuery.title)
		matchConditions.push({ title: { $regex: escapeRegex(parsedQuery.title), $options: 'i' } })
	if (parsedQuery.description)
		matchConditions.push({
			description: { $regex: escapeRegex(parsedQuery.description), $options: 'i' },
		})
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
					{ 'createdBy.name': { $regex: escapeRegex(parsedQuery.createdBy), $options: 'i' } },
					{ 'createdBy.email': { $regex: escapeRegex(parsedQuery.createdBy), $options: 'i' } },
				],
			},
		})
	}

	const pipeline = [...basePipeline, { $sort: { _id: -1 } }, { $skip: skip }, { $limit: limit }]
	const subjects = await Subject.aggregate(pipeline)

	const countPipeline = [...basePipeline, { $count: 'total' }]
	const countResult = await Subject.aggregate(countPipeline)
	const total = countResult[0]?.total || 0

	const subjectsWithImage = subjects.map((subject) => ({
		...convertSubjectToJSON(subject),
		createdBy: { ...convertUserToJSON(subject.createdBy) },
	}))

	return { subjects: subjectsWithImage, total }
}

export const findAllSubjects = async () => {
	const baseQuery = Subject.find({ isActive: true }).sort({ _id: -1 })
	const subjects = await applyPopulate(baseQuery, true, [POPULATE.IMAGE, POPULATE.USER])
	const total = await Subject.countDocuments(baseQuery)
	return { subjects, total }
}

export const createNewSubject = async (request) => {
	const { title, slug, description, user, file } = request

	let finalSlug = slug
	let count = 1
	while (await Subject.exists({ slug: finalSlug })) {
		finalSlug = `${slug}-${count++}`
	}

	const newSubjectPayload = {
		title,
		slug: finalSlug,
		description,
		createdBy: user.id,
	}
	if (file?.url) {
		const media = await mediaService.saveMedia(file)
		newSubjectPayload.image = media
	}

	const newSubject = new Subject(newSubjectPayload)
	await newSubject.save()
	return await newSubject.populate([POPULATE.IMAGE, POPULATE.USER])
}

export const updateSubject = async (subject, request) => {
	const subjectId = subject.id
	const updates = {}
	let oldImage = ''

	if ('title' in request) {
		updates.title = request.title

		if (!('slug' in request)) {
			const baseSlug = slugify(request.title, { lower: true, strict: true })
			let finalSlug = baseSlug
			let count = 1
			while (await Subject.exists({ slug: finalSlug })) {
				finalSlug = `${baseSlug}-${count++}`
			}
			updates.slug = finalSlug
		}
	}
	if ('slug' in request) {
		const exists = await Subject.exists({ slug: request.slug, _id: { $ne: subjectId } })
		if (exists) throw new ConflictError('Slug already taken.')
		updates.slug = request.slug
	}
	if ('description' in request) updates.description = request.description
	if (request.file?.url) {
		oldImage = subject.image
		const media = await mediaService.saveMedia(request.file)
		updates.image = media
	}

	const updatedSubject = await Subject.findByIdAndUpdate(
		subjectId,
		{ $set: updates },
		{ new: true }
	).populate(SUBJECT_POPULATE)

	if (oldImage) await deleteMediaFile(oldImage)
	return updatedSubject
}

export const deleteSubject = async (subject) => {
	return await subject.deleteOne()
}
