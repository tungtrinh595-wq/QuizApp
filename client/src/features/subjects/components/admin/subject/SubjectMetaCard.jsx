import { useSelector } from 'react-redux'

import { PencilIcon } from '@/assets/icons'
import { useModal } from '@/hooks'
import { SubjectEditForm } from '@/features'
import { Button, MetaCard, Modal } from '@/components'

const SubjectMetaCard = ({ subjectId }) => {
	const subjects = useSelector((state) => state.subjects)
	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null
	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()

	return (
		<>
			<MetaCard
				image={subject?.image?.url}
				title={subject?.title}
				description={subject?.description}
				editButton={
					<Button
						size="xs"
						variant="roundGroup"
						color="neutral"
						onClick={openEditModal}
						startIcon={<PencilIcon />}
					>
						Sửa
					</Button>
				}
			/>

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật môn học
						</h4>
					</div>
					<SubjectEditForm subject={subject} closeModal={closeEditModal} />
				</div>
			</Modal>
		</>
	)
}

export default SubjectMetaCard
