import { BREADCRUMB, PAGE_TITLES } from '@/constants'
import { PlusIcon } from '@/assets/icons'
import { useModal } from '@/hooks'
import { LessonsTable, LessonAddForm } from '@/features'
import { Modal, Button, PageMeta, ComponentCard, PageBreadcrumb } from '@/components'

const AdminLessons = () => {
	const { isOpen, openModal, closeModal } = useModal()

	return (
		<>
			<PageMeta
				title="Quản lý bài học | Bảng điều khiển quản trị – Quiz App"
				description="Quản lý bài học, mô tả và người tạo từ Bảng điều khiển quản trị của Quiz App. Được xây dựng bằng React và Tailwind CSS."
			/>
			<PageBreadcrumb breadcrumbs={[BREADCRUMB.ADMIN]} pageTitle={PAGE_TITLES.ADMIN.LESSONS} />
			<div className="mt-6 space-y-6">
				<ComponentCard
					title="Bài học"
					desc="Quản lý các bài học"
					headlineButton={
						<Button size="sm" onClick={openModal} startIcon={<PlusIcon />}>
							Thêm bài học
						</Button>
					}
				>
					<LessonsTable />
				</ComponentCard>
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Thêm bài học mới
						</h4>
					</div>
					<LessonAddForm closeModal={closeModal} />
				</div>
			</Modal>
		</>
	)
}

export default AdminLessons
