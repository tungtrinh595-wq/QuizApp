import { useDispatch, useSelector } from 'react-redux'

import { PREFIX, QUIZ_TYPE } from '@/constants'
import { PlusIcon } from '@/assets/icons'
import { useModal } from '@/hooks'
import { assignQuestionToQuiz, QuizQuestionsTable, QuestionAddForm } from '@/features'
import { Modal, Button, ComponentCard } from '@/components'

const QuizQuestionsCard = ({ subjectId, quizId, verticalScroll = false }) => {
	const dispatch = useDispatch()
	const { isOpen, openModal, closeModal } = useModal()
	const quizzes = useSelector((state) => state.quizzes)

	const quiz = quizzes.quizMap?.[quizId]
	const isSurvey = quiz?.type && quiz.type === QUIZ_TYPE.SURVEY.value
	const componentTitle = isSurvey
		? 'Danh sách các câu hỏi khảo sát'
		: 'Danh sách các câu hỏi trong đề thi'

	const handleAssignQuizQuestion = (question) => {
		if (quizId && question?.id) {
			dispatch(assignQuestionToQuiz({ quizId, questionId: question.id }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.ADD_FAILED))
		}
	}

	return (
		<>
			<ComponentCard
				className="h-full"
				title={componentTitle}
				headlineButton={
					<Button size="sm" onClick={openModal} startIcon={<PlusIcon />}>
						Thêm câu hỏi
					</Button>
				}
			>
				<div className={verticalScroll ? 'custom-scrollbar max-h-[450px] overflow-y-auto' : ''}>
					<QuizQuestionsTable
						subjectId={subjectId}
						quizId={quizId}
						horizontalScroll={!verticalScroll}
					/>
				</div>
			</ComponentCard>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Thêm câu hỏi mới
						</h4>
					</div>
					<QuestionAddForm
						subjectId={subjectId}
						closeModal={closeModal}
						handleAfterSubmit={(question) => handleAssignQuizQuestion(question)}
					/>
				</div>
			</Modal>
		</>
	)
}

export default QuizQuestionsCard
