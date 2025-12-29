import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

import { ROLE, ROUTES, PREFIX, SUCCESS_MESSAGES, FILTER_TYPE, PROVIDER } from '@/constants'
import { EyeIcon, PencilIcon, UserMinusIcon } from '@/assets/icons'
import { formatDate, handleError, handleSuccess } from '@/utils'
import { useModal } from '@/hooks'
import {
	getUsers,
	deleteUser,
	setUsersQuery,
	setUsersPrevQuery,
	UserEditForm,
} from '@/features'
import { Modal, Button, DataTable, ProviderInfo, UserRoleBadge } from '@/components'

const UsersTable = () => {
	const dispatch = useDispatch()
	const users = useSelector((state) => state.users)

	const [selectedUser, setSelectedUser] = useState()
	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()
	const {
		isOpen: isOpenDelete,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal()

	const handleEditUser = (user) => {
		setSelectedUser(user)
		openEditModal()
	}

	const handleRemoveUser = (user) => {
		setSelectedUser(user)
		openDeleteModal()
	}

	const confirmRemoveUser = () => {
		dispatch(deleteUser({ id: selectedUser.id }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.USER_DELETED)
				closeDeleteModal()
			})
			.catch((error) => handleError(error, PREFIX.DELETE_FAILED))
	}

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'user',
				header: 'Người dùng',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
				render: (user) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-full">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', user.slug)}>
								<img
									width={40}
									height={40}
									src={user.avatar?.url}
									alt={user.name}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', user.slug)}>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">{user.name}</span>
								<span className="block text-gray-500 dark:text-gray-400 text-theme-xs">{user.email}</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'provider',
				header: 'Đăng nhập qua',
				filter: FILTER_TYPE.SELECT,
				filterPlaceholder: 'lọc theo',
				filterOptions: Object.values(PROVIDER),
				headerClassName: 'whitespace-nowrap',
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (user) => (
					<div className="flex flex-col items-center justify-center gap-2">
						<ProviderInfo provider={user.provider} />
					</div>
				),
			},
			{
				accessorKey: 'createdAt',
				header: 'Thời điểm gia nhập',
				headerClassName: 'whitespace-nowrap',
				filter: FILTER_TYPE.DATETIME,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (user) => <div className="flex -space-x-2">{formatDate(user.createdAt)}</div>,
			},
			{
				accessorKey: 'role',
				header: 'Vai trò',
				headerClassName: 'min-w-2.5',
				filter: FILTER_TYPE.SELECT,
				filterOptions: Object.values(ROLE),
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (user) => <UserRoleBadge role={user.role} />,
			},
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (user) => (
					<div className="flex flex-1 flex-col w-full items-center justify-center gap-2 xl:flex-row">
						<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', user.slug)}>
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
							onClick={() => handleEditUser(user)}
							startIcon={<PencilIcon />}
						>
							Sửa
						</Button>
						{user.role !== ROLE.ADMIN.value && (
							<Button
								size="xs"
								variant="roundGroup"
								color="warning"
								onClick={() => handleRemoveUser(user)}
								startIcon={
									<UserMinusIcon className="fill-warning-700 group-hover:fill-warning-800" />
								}
							>
								Xóa
							</Button>
						)}
					</div>
				),
			},
		]
	}, [])

	useEffect(() => {
		const hasQueryChanged = !isEqual(users.prevQuery, users.query)
		if (!Array.isArray(users.list) || hasQueryChanged) {
			dispatch(getUsers({ queryRequest: users.query }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))

			dispatch(setUsersPrevQuery(users.query))
		}
	}, [users.query])

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-700">
				<div className="max-w-full overflow-x-auto">
					<DataTable
						columns={columns}
						data={users.list || []}
						totalPages={users.totalPages || 0}
						isLoading={users.list?.length === 0 && users.isLoading}
						query={users.query}
						setQuery={(query) => dispatch(setUsersQuery(query))}
					/>
				</div>
			</div>

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật thông tin người dùng
						</h4>
					</div>
					<UserEditForm user={selectedUser} closeModal={closeEditModal} />
				</div>
			</Modal>

			<Modal isOpen={isOpenDelete} onClose={closeDeleteModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Xác nhận xóa người dùng
						</h4>
						<div className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							<p>Bạn có chắc muốn xóa người dùng này?</p>
							<p>
								<b>
									{selectedUser?.name} - {selectedUser?.email}
								</b>
							</p>
							<p>
								Sau khi xóa, người dùng này sẽ bị vô hiệu hóa trên hệ thống và không thể truy cập
								bằng bất cứ cách nào.
							</p>
						</div>
					</div>
					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeDeleteModal}>
							Đóng
						</Button>
						<Button onClick={confirmRemoveUser} disabled={users.isLoading} size="md">
							Xác nhận
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default UsersTable
