import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ROUTES, PREFIX, FILTER_TYPE, QUERY_DEFAULT, SUCCESS_MESSAGES } from '@/constants'
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/assets/icons'
import { formatDate, handleError, handleSuccess } from '@/utils'
import { useModal, useInitialFetch, useFilteredPagination } from '@/hooks'
import { deleteSubject, getSubjects, SubjectEditForm } from '@/features'
import { Modal, Button, DataTable } from '@/components'

const SubjectsTable = () => {
	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const subjectList = subjects.list || []
	const [selectedSubject, setSelectedSubject] = useState()

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Môn học',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
				render: (subject) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-md">
							<Link to={ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', subject.id)}>
								<img
									width={40}
									height={40}
									src={subject.image?.url}
									alt={subject.title}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div>
							<Link to={ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', subject.id)}>
								<span className="flex-1 block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{subject.title}
								</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'description',
				header: 'Mô tả',
				bodyClassName:
					'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px] max-w-[250px]',
				render: (subject) => <div className="-space-x-2 line-clamp-2">{subject.description}</div>,
			},
			{
				accessorKey: 'createdBy',
				header: 'Người tạo',
				filterBy: ['createdBy.name', 'createdBy.email'],
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
				render: (subject) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-full">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', subject.createdBy?.slug)}>
								<img
									width={40}
									height={40}
									src={subject.createdBy?.avatar?.url}
									alt={subject.createdBy?.name}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', subject.createdBy?.slug)}>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{subject.createdBy?.name}
								</span>
								<span className="block text-gray-500 dark:text-gray-400 text-theme-xs">
									{subject.createdBy?.email}
								</span>
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
				render: (subject) => <div className="flex -space-x-2">{formatDate(subject.createdAt)}</div>,
			},
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (subject) => (
					<div className="flex flex-1 flex-col w-full items-center justify-center gap-2 xl:flex-row">
						<Link to={ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', subject.id)}>
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
							onClick={() => handleEditSubject(subject)}
							startIcon={<PencilIcon />}
						>
							Sửa
						</Button>
						<Button
							size="xs"
							variant="roundGroup"
							color="warning"
							onClick={() => handleRemoveSubject(subject)}
							startIcon={<TrashBinIcon className="fill-warning-700 group-hover:fill-warning-800" />}
						>
							Xóa
						</Button>
					</div>
				),
			},
		]
	}, [])
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredSubjects, totalPages } = useFilteredPagination(
		subjectList,
		columns,
		localQuery
	)

	useInitialFetch(subjects.list, getSubjects)

	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()

	const {
		isOpen: isOpenDelete,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal()

	const handleEditSubject = (subject) => {
		setSelectedSubject(subject)
		openEditModal()
	}

	const handleRemoveSubject = (subject) => {
		setSelectedSubject(subject)
		openDeleteModal()
	}

	const confirmRemoveSubject = () => {
		dispatch(deleteSubject({ id: selectedSubject.id }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.SUBJECT_DELETED)
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
						data={filteredSubjects}
						totalPages={totalPages}
						isLoading={filteredSubjects.length === 0 && subjects.isLoading}
						query={localQuery}
						setQuery={setLocalQuery}
					/>
				</div>
			</div>

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật môn học
						</h4>
					</div>
					<SubjectEditForm subject={selectedSubject} closeModal={closeEditModal} />
				</div>
			</Modal>

			<Modal isOpen={isOpenDelete} onClose={closeDeleteModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Xác nhận xóa môn học
						</h4>
						<div className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							<p>
								Bạn có chắc muốn xóa môn học <b>{selectedSubject?.title}</b> này?
							</p>
						</div>
					</div>
					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeDeleteModal}>
							Đóng
						</Button>
						<Button onClick={confirmRemoveSubject} disabled={subjects.isLoading} size="md">
							Xác nhận
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default SubjectsTable
