import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { BREADCRUMB, PAGE_TITLES, PREFIX, QUIZ_TYPE, ROUTES } from '@/constants'
import {
	getQuizResult,
	getQuizDetailsBySlug,
	UserResult,
	UserQuizForm,
	UserQuizMetaCard,
} from '@/features'
import { Banner, PageMeta, PageBreadcrumb } from '@/components'
import { handleError } from '@/utils'

const UserQuizDetails = () => {
	const navigate = useNavigate()
	const { slug } = useParams()
	const hasFetched = useRef(false)
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)
	const results = useSelector((state) => state.results)
	const quizId = Object.values(quizzes.quizMap || {}).find((q) => q.slug === slug)?.id
	const quiz = quizzes.quizMap?.[quizId]
	const result = results.quizResultMap?.[quizId]?.result
	const isExam = quiz?.type === QUIZ_TYPE.EXAM.value
	const startTime = new Date(quiz?.timeStart)
	const endTime = new Date(startTime.getTime() + quiz?.timeLimit * 60 * 1000)
	const now = new Date()
	const hasNotStarted = quiz && isExam && now < startTime
	const hasEnded = quiz && isExam && now > endTime

	useEffect(() => {
		if (!hasFetched.current && !quiz) {
			dispatch(getQuizDetailsBySlug({ slug }))
				.unwrap()
				.then(({ quiz }) => dispatch(getQuizResult({ quizId: quiz.id })))
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate))
			hasFetched.current = true
		}
	}, [slug, quiz])

	return (
		<>
			<PageMeta
				title="Chi tiết bài thi | Bảng điều khiển Quản trị – Quiz App"
				description="Xem thông tin chi tiết về bài thi, bao gồm tiêu đề, mô tả, thời gian thi và điểm số. Trang quản trị của hệ thống Quiz App, xây dựng bằng React và Tailwind CSS."
			/>
			<div className="flex flex-col gap-6">
				<Banner
					image={quiz?.image?.url}
					title={quiz?.title}
					description={quiz?.description}
					isLoading={quizzes.isLoading}
				/>
				<div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pb-6 flex flex-col gap-6">
					{quiz && (
						<>
							<PageBreadcrumb
								breadcrumbs={[
									BREADCRUMB.HOME,
									...(slug && quiz?.subject?.title && quiz?.subject?.slug
										? [
												{
													link: ROUTES.SUBJECT_DETAILS.replace(':slug', quiz.subject.slug),
													title: quiz?.subject?.title,
												},
										  ]
										: []),
								]}
								pageTitle={quiz?.title || PAGE_TITLES.QUIZ_DETAILS}
								showPageTitle={false}
							/>
							<UserQuizMetaCard quizId={quizId} />
							{result ? (
								<UserResult quizId={quizId} />
							) : hasNotStarted ? (
								<p className="text-xl font-medium text-brand-950 dark:text-white/90">Kỳ thi chưa bắt đầu!</p>
							) : hasEnded ? (
								<p className="text-xl font-medium text-brand-950 dark:text-white/90">Kỳ thi đã kết thúc!</p>
							) : (
								<UserQuizForm quizId={quizId} />
							)}
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default UserQuizDetails
