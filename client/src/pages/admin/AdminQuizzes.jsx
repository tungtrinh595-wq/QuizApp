import { BREADCRUMB, PAGE_TITLES } from '@/constants'
import { PlusIcon } from '@/assets/icons'
import { useModal } from '@/hooks'
import { QuizAddForm, QuizzesTable } from '@/features'
import { Modal, Button, PageMeta, PageBreadcrumb, ComponentCard } from '@/components'

const AdminQuizzes = () => {
	const { isOpen, openModal, closeModal } = useModal()

	return (
		<>
			<PageMeta
				title="Quản lý bài thi | Bảng điều khiển Quản trị – Quiz App"
				description="Xem, tìm kiếm và quản lý danh sách bài thi trong hệ thống. Trang quản trị của Quiz App, xây dựng bằng React và Tailwind CSS."
			/>
			<PageBreadcrumb breadcrumbs={[BREADCRUMB.ADMIN]} pageTitle={PAGE_TITLES.ADMIN.QUIZZES} />

			<div className="mt-6 space-y-6">
				<ComponentCard
					title="Bài thi"
					desc="Quản lý các bài thi"
					headlineButton={
						<Button size="sm" onClick={openModal} startIcon={<PlusIcon />}>
							Thêm bài thi
						</Button>
					}
				>
					<QuizzesTable />
				</ComponentCard>
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Thêm bài thi mới
						</h4>
					</div>
					<QuizAddForm closeModal={closeModal} />
				</div>
			</Modal>
		</>
	)
}

export default AdminQuizzes
