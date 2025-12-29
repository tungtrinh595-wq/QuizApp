import { useDispatch, useSelector } from 'react-redux'

import { useSocket } from '@/hooks'
import {
	addLesson,
	updateLesson,
	removeLesson,
	removeLessonFile,
	uploadLessonFiles,
	updateOrdersLesson,
} from '@/features/lessons'
import {
	addSubject,
	updateSubject,
	removeSubject,
	addSubjectLesson,
	updateSubjectLesson,
	removeSubjectLesson,
	updateOrdersSubjectLesson,
} from '@/features/subjects'
import { updateResult } from '@/features/results'
import { cacheUserProfile } from '@/features/users'
import { addQuiz, removeQuiz, updateQuiz } from '@/features/quizzes'
import { addMessage, updateMessage, removeMessage } from '@/features/messages'

const SocketListener = () => {
	const auth = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	const handleSocket = (payload, action) => {
		const { emitter } = payload
		if (emitter?.id !== auth.me?.id) dispatch(action(payload))
	}

	useSocket('user-updated', (payload) => handleSocket(payload, cacheUserProfile))

	useSocket('subject-created', (payload) => handleSocket(payload, addSubject))
	useSocket('subject-updated', (payload) => handleSocket(payload, updateSubject))
	useSocket('subject-deleted', (payload) => handleSocket(payload, removeSubject))

	useSocket('lesson-created', (payload) => {
		handleSocket(payload, addLesson)
		handleSocket(payload, addSubjectLesson)
	})
	useSocket('lesson-updated', (payload) => {
		handleSocket(payload, updateLesson)
		handleSocket(payload, updateSubjectLesson)
	})

	useSocket('lesson-deleted', (payload) => {
		handleSocket(payload, removeLesson)
		handleSocket(payload, removeSubjectLesson)
	})
	useSocket('lesson-remove-file', (payload) => handleSocket(payload, removeLessonFile))
	useSocket('lesson-upload-files', (payload) => handleSocket(payload, uploadLessonFiles))
	useSocket('lesson-orders-updated', (payload) => {
		handleSocket(payload, updateOrdersLesson)
		handleSocket(payload, updateOrdersSubjectLesson)
	})

	useSocket('message-created', (payload) => handleSocket(payload, addMessage))
	useSocket('message-updated', (payload) => handleSocket(payload, updateMessage))
	useSocket('message-deleted', (payload) => handleSocket(payload, removeMessage))

	useSocket('quiz-created', (payload) => handleSocket(payload, addQuiz))
	useSocket('quiz-updated', (payload) => handleSocket(payload, updateQuiz))
	useSocket('quiz-deleted', (payload) => handleSocket(payload, removeQuiz))

	useSocket('result-updated', (payload) => handleSocket(payload, updateResult))

	return null
}

export default SocketListener
