import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
	ROUTES,
	PREFIX,
	FILTER_TYPE,
	LESSON_STATUS,
	QUERY_DEFAULT,
	SUCCESS_MESSAGES,
} from '@/constants'
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/assets/icons'
import { formatDate, handleSuccess, handleError } from '@/utils'
import { useFilteredPagination, useModal } from '@/hooks'
import { deleteLesson, reorderLessons, LessonEditForm } from '@/features'
import { Modal, Button, DragDataTable, LessonStatusBadge } from '@/components'

const SubjectLessonsTable = ({ subjectId }) => {
	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null
	const [selectedLesson, setSelectedLesson] = useState()
	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()
	const {
		isOpen: isOpenDelete,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal()

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Môn học',
				bodyClassName: 'px-4 py-3 sm:px-6 text-start',
				render: (lesson) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-md">
							<Link
								to={ROUTES.ADMIN.SUBJECT_LESSON_DETAILS.replace(':subjectId', subjectId).replace(
									':id',
									lesson.id
								)}
							>
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
							<Link
								to={ROUTES.ADMIN.SUBJECT_LESSON_DETAILS.replace(':subjectId', subjectId).replace(
									':id',
									lesson.id
								)}
							>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{lesson.title}
								</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'description',
				header: 'Mô tả',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm max-w-[250px]',
				render: (lesson) => <div className="-space-x-2 line-clamp-2">{lesson.description}</div>,
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
				header: 'Trạng Thái',
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
						<Link
							to={ROUTES.ADMIN.SUBJECT_LESSON_DETAILS.replace(':subjectId', subjectId).replace(
								':id',
								lesson.id
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
	const lessons = subject?.lessons || []
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredLessons, totalPages } = useFilteredPagination(
		lessons,
		columns,
		localQuery
	)

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

	const handleSort = (orderList) => {
		dispatch(reorderLessons({ orderList }))
			.unwrap()
			.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
	}

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-700">
				<div className="max-w-full overflow-x-auto">
					<DragDataTable
						id="subjectLessonsTable"
						columns={columns}
						data={filteredLessons}
						totalPages={totalPages}
						isLoading={filteredLessons.length === 0 && subjects.isLoading}
						query={localQuery}
						setQuery={setLocalQuery}
						handleSort={(orderList) => handleSort(orderList)}
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
					<LessonEditForm
						subjectId={subject?.id}
						lesson={selectedLesson}
						closeModal={closeEditModal}
					/>
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

export default SubjectLessonsTable
