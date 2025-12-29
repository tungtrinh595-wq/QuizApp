import { PlusIcon } from '@/assets/icons'
import { useModal } from '@/hooks'
import { QuizAddForm, SubjectQuizsTable } from '@/features'
import { Modal, Button, ComponentCard } from '@/components'

const SubjectQuizsCard = ({ subjectId }) => {
	const { isOpen, openModal, closeModal } = useModal()

	return (
		<>
			<div className="space-y-6">
				<ComponentCard
					title="Danh sách các kỳ thi"
					headlineButton={
						<Button size="sm" onClick={openModal} startIcon={<PlusIcon />}>
							Thêm bài thi
						</Button>
					}
				>
					<SubjectQuizsTable subjectId={subjectId} />
				</ComponentCard>
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Thêm bài thi mới
						</h4>
					</div>
					<QuizAddForm subjectId={subjectId} closeModal={closeModal} />
				</div>
			</Modal>
		</>
	)
}

export default SubjectQuizsCard
