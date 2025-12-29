import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
	ROUTES,
	PREFIX,
	FILTER_TYPE,
	QUERY_DEFAULT,
	LESSON_STATUS,
	SUCCESS_MESSAGES,
} from '@/constants'
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/assets/icons'
import { formatDate, handleError, handleSuccess } from '@/utils'
import { useModal, useInitialFetch, useFilteredPagination } from '@/hooks'
import { deleteLesson, getLessons, LessonEditForm } from '@/features'
import { Modal, Button, DataTable, LessonStatusBadge } from '@/components'

const LessonsTable = () => {
	const dispatch = useDispatch()
	const lessons = useSelector((state) => state.lessons)
	const [selectedLesson, setSelectedLesson] = useState()

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Bài học',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
				render: (lesson) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-md">
							<Link to={ROUTES.ADMIN.LESSON_DETAILS.replace(':id', lesson.id)}>
								<img
									width={40}
									height={40}
									src={lesson.image.url}
									alt={lesson.title}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.LESSON_DETAILS.replace(':id', lesson.id)}>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{lesson.title}
								</span>
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
				render: (lesson) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-md">
							<Link to={ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', lesson.subject?.id)}>
								<img
									width={40}
									height={40}
									src={lesson.subject?.image?.url}
									alt={lesson.subject?.title}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', lesson.subject?.id)}>
								<span className="block text-gray-800 dark:text-white/90 text-theme-sm">{lesson.subject?.title}</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'description',
				header: 'Mô tả',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
				render: (lesson) => <div className="-space-x-2 line-clamp-2">{lesson.description}</div>,
			},
			{
				accessorKey: 'createdBy',
				header: 'Người tạo',
				filterBy: ['createdBy.name', 'createdBy.email'],
				bodyClassName:
					'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px] xl:align-center',
				render: (lesson) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-full">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', lesson.createdBy?.slug)}>
								<img
									width={40}
									height={40}
									src={lesson.createdBy?.avatar?.url}
									alt={lesson.createdBy?.name}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', lesson.createdBy?.slug)}>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{lesson.createdBy?.name}
								</span>
								<span className="block text-gray-500 dark:text-gray-400 text-theme-xs">{lesson.createdBy?.email}</span>
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
				render: (lesson) => <div className="flex -space-x-2">{formatDate(lesson.createdAt)}</div>,
			},
			{
				accessorKey: 'status',
				header: 'Trạng thái',
				headerClassName: 'min-w-2.5',
				filter: FILTER_TYPE.SELECT,
				filterOptions: Object.values(LESSON_STATUS),
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (lesson) => <LessonStatusBadge status={lesson.status} />,
			},
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (lesson) => (
					<div className="flex flex-1 flex-col w-full items-center justify-center gap-2 xl:flex-row">
						<Link to={ROUTES.ADMIN.LESSON_DETAILS.replace(':id', lesson.id)}>
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
							onClick={() => handleEditLesson(lesson)}
							startIcon={<PencilIcon />}
						>
							Sửa
						</Button>
						<Button
							size="xs"
							variant="roundGroup"
							color="warning"
							onClick={() => handleRemoveLesson(lesson)}
							startIcon={<TrashBinIcon className="fill-warning-700 group-hover:fill-warning-800" />}
						>
							Xóa
						</Button>
					</div>
				),
			},
		]
	}, [])
	const lessonList = lessons.list || []
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredLessons, totalPages } = useFilteredPagination(
		lessonList,
		columns,
		localQuery
	)

	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()
	const {
		isOpen: isOpenDelete,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal()

	useInitialFetch(lessons.list, getLessons)

	const handleEditLesson = (lesson) => {
		setSelectedLesson(lesson)
		openEditModal()
	}

	const handleRemoveLesson = (lesson) => {
		setSelectedLesson(lesson)
		openDeleteModal()
	}

	const confirmRemoveLesson = () => {
		dispatch(deleteLesson({ id: selectedLesson.id }))
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
						data={filteredLessons}
						totalPages={totalPages}
						isLoading={filteredLessons.length === 0 && lessons.isLoading}
						query={localQuery}
						setQuery={setLocalQuery}
					/>
				</div>
			</div>

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật bài học
						</h4>
					</div>
					<LessonEditForm lesson={selectedLesson} closeModal={closeEditModal} />
				</div>
			</Modal>

			<Modal isOpen={isOpenDelete} onClose={closeDeleteModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Xác nhận xóa bài học
						</h4>
						<div className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							<p>
								Bạn có chắc muốn xóa bài học <b>{selectedLesson?.title}</b> này?
							</p>
						</div>
					</div>
					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeDeleteModal}>
							Đóng
						</Button>
						<Button onClick={confirmRemoveLesson} disabled={lessons.isLoading} size="md">
							Xác nhận
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default LessonsTable
