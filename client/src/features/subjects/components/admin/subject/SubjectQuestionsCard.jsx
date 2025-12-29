import { PlusIcon } from '@/assets/icons'
import { useModal } from '@/hooks'
import { QuestionAddForm, SubjectQuestionsTable } from '@/features'
import { Modal, Button, ComponentCard } from '@/components'

const SubjectQuestionsCard = ({ subjectId, quizId, verticalScroll = false }) => {
	const { isOpen, openModal, closeModal } = useModal()

	return (
		<>
			<ComponentCard
				className="h-full"
				title="Thư viện câu hỏi"
				headlineButton={
					<Button size="sm" onClick={openModal} startIcon={<PlusIcon />}>
						Thêm câu hỏi
					</Button>
				}
			>
				<div className={verticalScroll ? 'custom-scrollbar max-h-[450px] overflow-y-auto' : ''}>
					<SubjectQuestionsTable subjectId={subjectId} quizId={quizId} />
				</div>
			</ComponentCard>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Thêm câu hỏi mới
						</h4>
					</div>
					<QuestionAddForm subjectId={subjectId} closeModal={closeModal} />
				</div>
			</Modal>
		</>
	)
}

export default SubjectQuestionsCard
