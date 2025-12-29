import * as subjectServices from '../services/subjects.js'
import { LIMIT_QUERY_DEFAULT } from '../constants/index.js'
import { NotFoundError, UnprocessableEntityError } from '../utils/errors.js'

export const attachSubjectById =
	(paramName = 'id', withDetails = false) =>
	async (req, res, next) => {
		const subjectId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!subjectId) throw new UnprocessableEntityError('ID môn học bị thiếu')

		req.foundSubject = await subjectServices.findSubjectById(subjectId, withDetails)
		if (!req.foundSubject) throw new NotFoundError('Không tìm thấy môn học')
		next()
	}

export const attachSubjectBySlug =
	(paramName = 'slug', withDetails = false) =>
	async (req, res, next) => {
		const slug = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!slug) throw new UnprocessableEntityError('slug không hợp lệ')

		req.foundSubject = await subjectServices.findSubjectBySlug(slug, withDetails)
		if (!req.foundSubject) throw new NotFoundError('Không tìm thấy môn học')
		next()
	}

export const attachOptionalSubjectById =
	(paramName = 'id', withDetails = false) =>
	async (req, res, next) => {
		const subjectId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!subjectId) throw new UnprocessableEntityError('ID môn học bị thiếu')

		req.foundSubject = await subjectServices.findSubjectById(subjectId, withDetails)
		if (!req.foundSubject) next()
		next()
	}

export const attachSubjectsByCursor = async (req, res, next) => {
	const { cursor, limit } = req.query
	req.subjects = await subjectServices.findSubjectsByCursor({
		cursor,
		limit: parseInt(limit) || LIMIT_QUERY_DEFAULT,
	})
	next()
}

export const attachSubjects = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
	const { subjects, total } = await subjectServices.findSubjects({
		queryRequest: req.query,
		page,
		limit,
	})
	req.subjects = subjects
	req.pagination = { page, limit, total }
	next()
}

export const attachAllSubjects = async (req, res, next) => {
	const { subjects, total } = await subjectServices.findAllSubjects()
	req.subjects = subjects
	req.total = total
	next()
}
