import { useSelector } from 'react-redux'

import { QUIZ_TYPE } from '@/constants'
import { formatDate, getQuizTypeLabel } from '@/utils'

const UserQuizMetaCard = ({ quizId }) => {
	const quizzes = useSelector((state) => state.quizzes)
	const quiz = quizzes.quizMap?.[quizId]
	const subjectTitle = quiz?.subject?.title ? `Bộ môn ${quiz?.subject?.title} - ` : ''
	const quizType = getQuizTypeLabel(quiz?.type)
	const quizTitle = quiz?.type && quiz?.title ? `${quizType} ${quiz?.title}` : ''
	const createdBy = quiz?.createdBy
	const isExam = quiz.type === QUIZ_TYPE.EXAM.value

	return (
		<>
			<div>
				<div className="w-full text-left mt-2 flex flex-col lg:flex-row justify-between gap-4">
					<div className="text-center lg:text-left space-y-1">
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							{`${subjectTitle}${quizTitle}`}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">{quiz?.description}</p>
						{isExam && quiz?.timeStart && (
							<p>
								Thời gian bắt đầu làm bài: <b>{formatDate(quiz.timeStart)}</b>
							</p>
						)}
						{isExam && quiz?.timeLimit && (
							<p>
								Giới hạn thời gian làm bài: <b>{quiz.timeLimit} phút</b>
							</p>
						)}
						{quiz?.quizQuestions?.length && (
							<p>
								Tổng số câu hỏi:{' '}
								<b>
									{quiz?.isRandom && quiz.randomCount > 0
										? quiz.randomCount
										: quiz.quizQuestions?.length}{' '}
									câu
								</b>
							</p>
						)}
					</div>
					<div className="text-center lg:text-right">
						<p>{quiz?.type === QUIZ_TYPE.SURVEY.value ? 'Người khảo sát:' : 'Người ra đề:'}</p>
						<div className="flex gap-2 items-center justify-center">
							<div className="w-15 h-15 overflow-hidden border border-gray-200 rounded-full">
								<img
									src={createdBy?.avatar?.url}
									alt="avatar"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex flex-wrap items-center gap-2">
								<p className="flex flex-wrap items-center gap-2">
									<span className="font-medium text-brand-950 dark:text-white/90">
										{createdBy?.name}
									</span>
									<span className="text-sm text-gray-500">{createdBy?.email}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default UserQuizMetaCard
