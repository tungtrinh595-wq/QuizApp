import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
	ROUTES,
	PREFIX,
	QUIZ_TYPE,
	FILTER_TYPE,
	QUERY_DEFAULT,
	SUCCESS_MESSAGES,
} from '@/constants'
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/assets/icons'
import { formatDate, handleError, handleSuccess } from '@/utils'
import { useModal, useInitialFetch, useFilteredPagination } from '@/hooks'
import { deleteQuiz, getQuizzes, QuizEditForm } from '@/features'
import { Modal, Button, DataTable, QuizTypeBadge } from '@/components'

const QuizzesTable = () => {
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Bài thi',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
				render: (quiz) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-md">
							<Link to={ROUTES.ADMIN.QUIZ_DETAILS.replace(':id', quiz.id)}>
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
							<Link to={ROUTES.ADMIN.QUIZ_DETAILS.replace(':id', quiz.id)}>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">{quiz.title}</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'subject',
				header: 'Môn học',
				filterBy: ['subject.title'],
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
				render: (quiz) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-md">
							<Link to={ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', quiz.subject?.id)}>
								<img
									width={40}
									height={40}
									src={quiz.subject?.image?.url}
									alt={quiz.subject?.title}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', quiz.subject?.id)}>
								<span className="block text-gray-800 dark:text-white/90 text-theme-sm">{quiz.subject?.title}</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'description',
				header: 'Mô tả',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
				render: (quiz) => <div className="-space-x-2 line-clamp-2">{quiz.description}</div>,
			},
			{
				accessorKey: 'createdBy',
				header: 'Người tạo',
				filterBy: ['createdBy.name', 'createdBy.email'],
				bodyClassName:
					'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px] xl:align-center',
				render: (quiz) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-full">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', quiz.createdBy?.slug)}>
								<img
									width={40}
									height={40}
									src={quiz.createdBy?.avatar?.url}
									alt={quiz.createdBy?.name}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', quiz.createdBy?.slug)}>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{quiz.createdBy?.name}
								</span>
								<span className="block text-gray-500 dark:text-gray-400 text-theme-xs">{quiz.createdBy?.email}</span>
							</Link>
						</div>
					</div>
				),
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
				header: 'Loại bài thi',
				headerClassName: 'whitespace-nowrap min-w-[120px]',
				filter: FILTER_TYPE.SELECT,
				filterOptions: Object.values(QUIZ_TYPE),
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (quiz) => <QuizTypeBadge type={quiz.type} />,
			},
			{
				accessorKey: 'timeStart',
				header: 'Thời gian bắt đầu thi',
				headerClassName: 'whitespace-nowrap',
				filter: FILTER_TYPE.DATETIME,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (quiz) => (
					<div className="flex -space-x-2">
						{quiz.timeStart ? formatDate(quiz.timeStart) : 'Không có'}
					</div>
				),
			},
			{
				accessorKey: 'timeLimit',
				header: 'Giới hạn thời gian',
				headerClassName: 'whitespace-nowrap',
				filter: FILTER_TYPE.NUMBER,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (quiz) => (
					<div className="flex -space-x-2">
						{quiz.timeLimit ? `${quiz.timeLimit} phút` : 'Không có'}
					</div>
				),
			},
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (quiz) => (
					<div className="flex flex-1 flex-col w-full items-center justify-center gap-2 xl:flex-row">
						<Link to={ROUTES.ADMIN.QUIZ_DETAILS.replace(':id', quiz.id)}>
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
	const quizList = quizzes.list || []
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredQuizzes, totalPages } = useFilteredPagination(
		quizList,
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

	useInitialFetch(quizzes.list, getQuizzes)

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
				handleSuccess(SUCCESS_MESSAGES.LESSON_DELETED)
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
						isLoading={filteredQuizzes.length === 0 && quizzes.isLoading}
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
					<QuizEditForm quiz={selectedQuiz} closeModal={closeEditModal} />
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

export default QuizzesTable
