import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/assets/icons'
import { handleSuccess, handleError } from '@/utils'
import { useFilteredPagination, useModal } from '@/hooks'
import {
	getSubjectDetails,
	getSubjectQuestions,
	assignQuestionToQuiz,
	deleteSubjectQuestion,
	QuestionEditForm,
} from '@/features'
import { Modal, Button, Tooltip, DataTable } from '@/components'

const SubjectQuestionsTable = ({ subjectId, quizId }) => {
	const hasSubjectFetched = useRef(false)
	const hasSubjectQuestiondFetched = useRef(false)
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)
	const subjects = useSelector((state) => state.subjects)
	const subject = subjects.subjectMap?.[subjectId]
	const quiz = quizzes.quizMap?.[quizId]
	const quizQuestions = quiz?.quizQuestions || []
	const [selectedQuestion, setSelectedQuestion] = useState()

	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()

	const {
		isOpen: isOpenDelete,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal()

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-2 py-1 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (question) => (
					<div className="flex flex-1 flex-row w-full items-center justify-center gap-2">
						{quizId && (
							<Tooltip
								content="Thêm câu hỏi vào đề thi"
								tooltipMinWidth="100px"
								position="topRight"
							>
								<Button
									size="xs"
									variant="roundGroup"
									color="neutral"
									onClick={() => handleAssignQuizQuestion(question)}
									startIcon={<PlusIcon />}
								/>
							</Tooltip>
						)}
						<Tooltip content="Sửa câu hỏi">
							<Button
								size="xs"
								variant="roundGroup"
								color="neutral"
								onClick={() => handleEditQuestion(question)}
								startIcon={<PencilIcon />}
							/>
						</Tooltip>
						<Tooltip content="Xóa câu hỏi">
							<Button
								size="xs"
								variant="roundGroup"
								color="warning"
								onClick={() => handleRemoveQuestion(question)}
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
				filterBy: ['question', 'answers.answer'],
				bodyClassName:
					'px-2 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
				render: (item) => <div className="-space-x-2 line-clamp-2">{item.question}</div>,
			},
		]
	}, [quizId])
	const subjectQuestions = subject?.questions || []
	const [localQuery, setLocalQuery] = useState({ limit: -1, page: 1 })
	const { filteredData: filteredQuestions, totalPages } = useFilteredPagination(
		subjectQuestions,
		columns,
		localQuery,
		{ quizQuestions }
	)

	useEffect(() => {
		if (!hasSubjectFetched.current && subjectId && !subject) {
			dispatch(getSubjectDetails({ id: subjectId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			hasSubjectFetched.current = true
		}
	}, [subjectId, subject])

	useEffect(() => {
		if (!hasSubjectQuestiondFetched.current && subjectId && !Array.isArray(subject?.questions)) {
			dispatch(getSubjectQuestions({ subjectId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			hasSubjectQuestiondFetched.current = true
		}
	}, [subjectId, subject?.questions])

	const handleAssignQuizQuestion = (question) => {
		dispatch(assignQuestionToQuiz({ quizId, questionId: question.id }))
			.unwrap()
			.catch((error) => handleError(error, PREFIX.ADD_FAILED))
	}

	const handleEditQuestion = (question) => {
		setSelectedQuestion(question)
		openEditModal()
	}

	const handleRemoveQuestion = (question) => {
		setSelectedQuestion(question)
		openDeleteModal()
	}

	const confirmRemoveQuestion = () => {
		const confirmSubjectId =
			typeof selectedQuestion.subject === 'string'
				? selectedQuestion.subject
				: selectedQuestion.subject?.id || subjectId || ''
		dispatch(deleteSubjectQuestion({ id: selectedQuestion.id, subjectId: confirmSubjectId }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.QUESTION_DELETED)
				closeDeleteModal()
			})
			.catch((error) => handleError(error, PREFIX.DELETE_FAILED))
	}

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-700">
				<div className={`max-w-full overflow-x-auto`}>
					<DataTable
						id="subjectQuestionsTable"
						columns={columns}
						data={filteredQuestions}
						totalPages={totalPages}
						isLoading={filteredQuestions.length === 0 && subjects.isLoading}
						query={localQuery}
						setQuery={setLocalQuery}
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
						question={selectedQuestion}
						closeModal={closeEditModal}
					/>
				</div>
			</Modal>

			<Modal isOpen={isOpenDelete} onClose={closeDeleteModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Xác nhận xóa câu hỏi
						</h4>
						<div className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							<p>Bạn có chắc muốn xóa câu hỏi này?</p>
							<p>
								<b>{selectedQuestion?.question}</b>
							</p>
						</div>
					</div>
					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeDeleteModal}>
							Đóng
						</Button>
						<Button onClick={confirmRemoveQuestion} disabled={subjects.isLoading} size="md">
							Xác nhận
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default SubjectQuestionsTable
