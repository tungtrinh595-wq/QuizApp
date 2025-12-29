import * as lessonFileService from '../services/lessonFiles.js'
import { NotFoundError, UnprocessableEntityError } from '../utils/errors.js'

export const attachLessonFileById =
	(paramName = 'id') =>
	async (req, res, next) => {
		const id = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!id) throw new UnprocessableEntityError('Tham số không hợp lệ')

		req.foundLessonFile = await lessonFileService.findLessonFileById(id)
		if (!req.foundLessonFile) throw new NotFoundError('Không tìm thấy tập tin đính kèm')
		next()
	}
