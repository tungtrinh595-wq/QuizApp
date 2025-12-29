import { HTTP_STATUS } from '../constants/index.js'
import * as subjectService from '../services/subjects.js'
import { safeSocketPost } from '../config/socketApi.js'

export const getSubjects = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({
		subjects: req.subjects,
		total: req.total,
	})
}

export const getSubject = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({ subject: req.foundSubject.toJSON() })
}

export const createNewSubject = async (req, res) => {
	const payload = { ...req.body, user: req.user, file: req.file }
	const subject = await subjectService.createNewSubject(payload)
	safeSocketPost('/subject/created', { emitter: req.user, subject })
	res.status(HTTP_STATUS.CREATED).json({ subject })
}

export const updateSubject = async (req, res) => {
	const payload = { ...req.body, file: req.file }
	const subject = await subjectService.updateSubject(req.foundSubject, payload)
	safeSocketPost('/subject/updated', { emitter: req.user, subject })
	res.status(HTTP_STATUS.OK).json({ subject })
}

export const deleteSubject = async (req, res) => {
	await subjectService.deleteSubject(req.foundSubject)
	safeSocketPost('/subject/deleted', { emitter: req.user, subject: req.foundSubject })
	res.status(HTTP_STATUS.NO_CONTENT).json()
}
