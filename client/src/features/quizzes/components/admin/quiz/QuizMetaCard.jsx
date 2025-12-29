import { useSelector } from 'react-redux'

import { QUIZ_TYPE } from '@/constants'
import { PencilIcon } from '@/assets/icons'
import { formatDate } from '@/utils'
import { useModal } from '@/hooks'
import { QuizEditForm } from '@/features'
import { Modal, Button, MetaCard, QuizTypeBadge } from '@/components'

const QuizMetaCard = ({ quizId }) => {
	const quizzes = useSelector((state) => state.quizzes)
	const quiz = quizzes.quizMap?.[quizId]
	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()
	const isQuiz = quiz?.type && [QUIZ_TYPE.EXAM.value, QUIZ_TYPE.PRACTICE.value].includes(quiz.type)

	return (
		<>
			<MetaCard
				image={quiz?.image?.url}
				title={quiz?.title}
				badge={<QuizTypeBadge type={quiz?.type} />}
				description={quiz?.description}
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
			>
				<div className="w-full text-left mt-2">
					{isQuiz && quiz?.timeStart && (
						<p>
							Thời gian bắt đầu làm bài: <b>{formatDate(quiz.timeStart)}</b>
						</p>
					)}
					{isQuiz && quiz?.timeLimit && (
						<p>
							Giới hạn thời gian làm bài: <b>{quiz.timeLimit} phút</b>
						</p>
					)}
					{isQuiz && quiz?.totalScore && (
						<p>
							Tổng số điểm của bài thi: <b>{quiz.totalScore} điểm</b>
						</p>
					)}
					{isQuiz && quiz?.passScore && (
						<p>
							Số điểm cần để vượt qua bài thi: <b>{quiz.passScore} điểm</b>
						</p>
					)}
				</div>
			</MetaCard>

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật bài thi
						</h4>
					</div>
					<QuizEditForm quiz={quiz} closeModal={closeEditModal} />
				</div>
			</Modal>
		</>
	)
}

export default QuizMetaCard
