import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PREFIX } from '@/constants'
import { PencilIcon, TrashBinIcon } from '@/assets/icons'
import { handleError } from '@/utils'
import { useFilteredPagination, useModal } from '@/hooks'
import { removeQuestionFromQuiz, reorderQuizQuestions, QuestionEditForm } from '@/features'
import { Modal, Button, Tooltip, DragDataTable } from '@/components'

const QuizQuestionsTable = ({ subjectId, quizId, horizontalScroll = true }) => {
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)

	const quiz = quizzes.quizMap?.[quizId]
	const [selectedQuestion, setSelectedQuestion] = useState()
	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-2 py-1 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (quizQuestion) => (
					<div className="flex flex-1 flex-row w-full items-center justify-center gap-2">
						<Tooltip content="Sửa câu hỏi" position="topRight">
							<Button
								size="xs"
								variant="roundGroup"
								color="neutral"
								onClick={() => handleEditQuestion(quizQuestion.question)}
								startIcon={<PencilIcon />}
							/>
						</Tooltip>
						<Tooltip content="Bỏ câu hỏi ra khỏi để thi" tooltipMinWidth="100px">
							<Button
								size="xs"
								variant="roundGroup"
								color="warning"
								onClick={() => handleRemoveQuizQuestion(quizId, quizQuestion.question.id)}
								startIcon={
									<TrashBinIcon className="fill-warning-700 group-hover:fill-warning-800" />
								}
							/>
						</Tooltip>
					</div>
				),
			},
			{
				accessorKey: 'question',
				header: 'Câu hỏi',
				filterBy: ['question.question', 'question.answers.answer'],
				bodyClassName: 'px-5 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
				render: (quizQuestion) => (
					<div className="-space-x-2 line-clamp-2">{quizQuestion.question?.question}</div>
				),
			},
		]
	}, [quiz])
	const quizQuestions = quiz?.quizQuestions || []
	const [localQuery, setLocalQuery] = useState({ limit: -1, page: 1 })
	const { filteredData: filteredQuestions, totalPages } = useFilteredPagination(
		quizQuestions,
		columns,
		localQuery
	)

	const handleEditQuestion = (question) => {
		setSelectedQuestion(question)
		openEditModal()
	}

	const handleRemoveQuizQuestion = (quizIdRequest, questionId) => {
		dispatch(removeQuestionFromQuiz({ quizId: quizIdRequest, questionId }))
			.unwrap()
			.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
	}

	const handleSort = (orderList) => {
		dispatch(reorderQuizQuestions({ orderList, quizId }))
			.unwrap()
			.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
	}

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-700">
				<div className={`max-w-full ${horizontalScroll ? 'overflow-x-auto' : ''}`}>
					<DragDataTable
						id="quizQuestionsTable"
						columns={columns}
						data={filteredQuestions}
						totalPages={totalPages}
						isLoading={filteredQuestions.length === 0 && quizzes.isLoading}
						query={localQuery}
						setQuery={setLocalQuery}
						handleSort={(orderList) => handleSort(orderList)}
						simplePaging={true}
					/>
				</div>
			</div>

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật câu hỏi
						</h4>
					</div>
					<QuestionEditForm
						subjectId={subjectId}
						quizId={quizId}
						question={selectedQuestion}
						closeModal={closeEditModal}
					/>
				</div>
			</Modal>
		</>
	)
}

export default QuizQuestionsTable
