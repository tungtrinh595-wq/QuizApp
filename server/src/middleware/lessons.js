import * as lessonService from '../services/lessons.js'
import { LIMIT_QUERY_DEFAULT, ROLE } from '../constants/index.js'
import { BadRequestError, NotFoundError, UnprocessableEntityError } from '../utils/errors.js'

export const attachLessonsByCursor = async (req, res, next) => {
	const { cursor, limit } = req.query

	if (req.user.role === ROLE.ADMIN)
		req.lessons = await lessonService.findLessonByCursor({
			cursor,
			limit: parseInt(limit) || LIMIT_QUERY_DEFAULT,
		})
	else
		req.lessons = await lessonService.findPublishedLessonByCursor({
			cursor,
			limit: parseInt(limit) || LIMIT_QUERY_DEFAULT,
		})
	next()
}

export const attachLessons =
	(onlyPublic = false) =>
	async (req, res, next) => {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
		const { lessons, total } = await lessonService.findLessons({
			queryRequest: req.query,
			page,
			limit,
			onlyPublic,
		})
		req.lessons = lessons
		req.pagination = { page, limit, total }
		next()
	}

export const attachAllLessons = async (req, res, next) => {
	const { lessons, total } = await lessonService.findAllLessons()
	req.lessons = lessons
	req.total = total
	next()
}

export const attachLessonById =
	(paramName = 'id', withDetails = false, onlyPublic = false) =>
	async (req, res, next) => {
		const lessonId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!lessonId) throw new UnprocessableEntityError('Tham số không hợp lệ')

		req.foundLesson = await lessonService.findLessonById(lessonId, withDetails, onlyPublic)
		if (!req.foundLesson) throw new NotFoundError('Không tìm thấy bài học')
		next()
	}

export const attachLessonBySlug =
	(paramName = 'slug', withDetails = false, onlyPublic = false) =>
	async (req, res, next) => {
		const slug = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!slug) throw new UnprocessableEntityError('slug không hợp lệ')

		req.foundLesson = await lessonService.findLessonBySlug(slug, withDetails, onlyPublic)
		if (!req.foundLesson) throw new NotFoundError('Không tìm thấy bài học')
		next()
	}

export const attachSubjectLessons = async (req, res, next) => {
	const subjectId = req.foundSubject.id
	const { cursor } = req.query
	req.limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
	req.lessons = await lessonService.findSubjectLessons({ subjectId, cursor, limit: req.limit })
	next()
}

export const attachListLessons =
	(paramName = 'orderList') =>
	async (req, res, next) => {
		let orderList = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!orderList) throw new UnprocessableEntityError('Danh sách bài học bị thiếu')

		if (typeof orderList === 'string') {
			try {
				orderList = JSON.parse(orderList)
			} catch (err) {
				throw new BadRequestError('Danh sách bài học không hợp lệ (không thể parse JSON)')
			}
		}

		const lessonIds = orderList.map((l) => l.id)
		req.foundLessons = await lessonService.findListLessons(lessonIds)
		if (!req.foundLessons || req.foundLessons.length === 0)
			throw new NotFoundError('Không tìm thấy bài học nào trong danh sách')

		const foundIds = req.foundLessons.map((l) => l.id.toString())
		const missingIds = lessonIds.filter((id) => !foundIds.includes(id))
		if (missingIds.length > 0) {
			throw new BadRequestError(`ID các bài học không hợp lệ: ${missingIds.join(', ')}`)
		}

		next()
	}
