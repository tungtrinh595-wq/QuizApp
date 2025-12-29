import { BREADCRUMB, PAGE_TITLES } from '@/constants'
import { UserPlusIcon } from '@/assets/icons'
import { useModal } from '@/hooks'
import { UsersTable, UserAddForm } from '@/features'
import { PageMeta, PageBreadcrumb, ComponentCard, Button, Modal } from '@/components'

const AdminUsers = () => {
	const { isOpen, openModal, closeModal } = useModal()

	return (
		<>
			<PageMeta
				title="Quản lý người dùng | Bảng điều khiển quản trị – Ứng dụng Quiz"
				description="Quản lý tài khoản người dùng, vai trò và hoạt động từ Bảng điều khiển quản trị của ứng dụng Quiz. Được xây dựng bằng React và Tailwind CSS."
			/>
			<PageBreadcrumb breadcrumbs={[BREADCRUMB.ADMIN]} pageTitle={PAGE_TITLES.ADMIN.USERS} />
			<div className="mt-6 space-y-6">
				<ComponentCard
					title="Người Dùng"
					desc="Quản lý tài khoản người dùng"
					headlineButton={
						<Button size="sm" onClick={openModal} startIcon={<UserPlusIcon />}>
							Thêm người dùng
						</Button>
					}
				>
					<UsersTable />
				</ComponentCard>
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Thêm người dùng mới
						</h4>
					</div>
					<UserAddForm closeModal={closeModal} />
				</div>
			</Modal>
		</>
	)
}

export default AdminUsers
