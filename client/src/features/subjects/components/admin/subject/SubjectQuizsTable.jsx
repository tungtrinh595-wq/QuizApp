import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
	PREFIX,
	ROUTES,
	QUIZ_TYPE,
	FILTER_TYPE,
	QUERY_DEFAULT,
	SUCCESS_MESSAGES,
} from '@/constants'
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/assets/icons'
import { formatDate, handleSuccess, handleError } from '@/utils'
import { useModal, useFilteredPagination } from '@/hooks'
import { deleteQuiz, QuizEditForm } from '@/features'
import { Modal, Button, DataTable, QuizTypeBadge } from '@/components'

const SubjectQuizsTable = ({ subjectId }) => {
	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Kỳ thi',
				bodyClassName: 'px-5 py-4 sm:px-6 text-start',
				render: (quiz) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-md">
							<Link
								to={ROUTES.ADMIN.SUBJECT_QUIZ_DETAILS.replace(':subjectId', subjectId).replace(
									':id',
									quiz.id
								)}
							>
								<img
									width={40}
									height={40}
									src={quiz.image.url}
									alt={quiz.title}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link
								to={ROUTES.ADMIN.SUBJECT_QUIZ_DETAILS.replace(':subjectId', subjectId).replace(
									':id',
									quiz.id
								)}
							>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">{quiz.title}</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'description',
				header: 'Mô tả',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm max-w-[250px]',
				render: (quiz) => <div className="-space-x-2 line-clamp-2">{quiz.description}</div>,
			},
			{
				accessorKey: 'createdAt',
				header: 'Thời điểm được tạo',
				headerClassName: 'whitespace-nowrap',
				filter: FILTER_TYPE.DATETIME,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (quiz) => <div className="flex -space-x-2">{formatDate(quiz.createdAt)}</div>,
			},
			{
				accessorKey: 'type',
				header: 'Loại kỳ thi',
				headerClassName: 'min-w-2.5',
				filter: FILTER_TYPE.SELECT,
				filterOptions: Object.values(QUIZ_TYPE),
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (quiz) => <QuizTypeBadge type={quiz.type} />,
			},
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (quiz) => (
					<div className="flex flex-1 flex-col w-full items-center justify-center gap-2 xl:flex-row">
						<Link
							to={ROUTES.ADMIN.SUBJECT_QUIZ_DETAILS.replace(':subjectId', subjectId).replace(
								':id',
								quiz.id
							)}
						>
							<Button
								size="xs"
								variant="roundGroup"
								color="neutral"
								startIcon={<EyeIcon className="fill-gray-500 size-5" />}
							>
								Xem
							</Button>
						</Link>
						<Button
							size="xs"
							variant="roundGroup"
							color="neutral"
							onClick={() => handleEditQuiz(quiz)}
							startIcon={<PencilIcon />}
						>
							Sửa
						</Button>
						<Button
							size="xs"
							variant="roundGroup"
							color="warning"
							onClick={() => handleRemoveQuiz(quiz)}
							startIcon={<TrashBinIcon className="fill-warning-700 group-hover:fill-warning-800" />}
						>
							Xóa
						</Button>
					</div>
				),
			},
		]
	}, [])
	const quizzes = subject?.quizzes || []
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredQuizzes, totalPages } = useFilteredPagination(
		quizzes,
		columns,
		localQuery
	)

	const [selectedQuiz, setSelectedQuiz] = useState()
	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()
	const {
		isOpen: isOpenDelete,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal()

	const handleEditQuiz = (quiz) => {
		setSelectedQuiz(quiz)
		openEditModal()
	}

	const handleRemoveQuiz = (quiz) => {
		setSelectedQuiz(quiz)
		openDeleteModal()
	}

	const confirmRemoveQuiz = () => {
		dispatch(deleteQuiz({ id: selectedQuiz.id }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.QUIZ_DELETED)
				closeDeleteModal()
			})
			.catch((error) => handleError(error, PREFIX.DELETE_FAILED))
	}

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-700">
				<div className="max-w-full overflow-x-auto">
					<DataTable
						columns={columns}
						data={filteredQuizzes}
						totalPages={totalPages}
						isLoading={filteredQuizzes.length === 0 && subjects.isLoading}
						query={localQuery}
						setQuery={setLocalQuery}
					/>
				</div>
			</div>

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật bài thi
						</h4>
					</div>
					<QuizEditForm subjectId={subject?.id} quiz={selectedQuiz} closeModal={closeEditModal} />
				</div>
			</Modal>

			<Modal isOpen={isOpenDelete} onClose={closeDeleteModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Xác nhận xóa bài thi
						</h4>
						<div className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							<p>
								Bạn có chắc muốn xóa bài thi <b>{selectedQuiz?.title}</b> này?
							</p>
						</div>
					</div>
					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeDeleteModal}>
							Đóng
						</Button>
						<Button onClick={confirmRemoveQuiz} disabled={quizzes.isLoading} size="md">
							Xác nhận
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default SubjectQuizsTable
