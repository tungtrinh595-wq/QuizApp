import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PAGE_TITLES, QUIZ_TYPE, BREADCRUMB, ROUTES, PREFIX, ROLE } from '@/constants'
import { getQuizTypeLabel, handleError } from '@/utils'
import {
	getQuizDetails,
	getSubjectDetails,
	QuizMetaCard,
	SurveyResponses,
	QuizQuestionsCard,
	ExcelQuizImporter,
	AllQuizResultsTable,
	SubjectQuestionsCard,
} from '@/features'
import { PageMeta, ComponentCard, PageBreadcrumb } from '@/components'

const AdminQuizDetails = () => {
	const navigate = useNavigate()
	const hasQuizFetched = useRef(false)
	const hasSubjectFetched = useRef(false)
	const { id: quizId, subjectId: paramSubjectId } = useParams()

	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const quizzes = useSelector((state) => state.quizzes)

	const subject = paramSubjectId ? subjects.subjectMap?.[paramSubjectId] : null
	const quiz = quizzes.quizMap?.[quizId]
	const subjectId = typeof quiz?.subject === 'string' ? quiz.subject : quiz?.subject?.id || ''
	const isSurvey = quiz?.type && quiz.type === QUIZ_TYPE.SURVEY.value

	const [breadcrumbs, setBreadcrumbs] = useState([BREADCRUMB.ADMIN])

	useEffect(() => {
		if (!hasSubjectFetched.current && paramSubjectId && !subject) {
			dispatch(getSubjectDetails({ id: paramSubjectId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate, ROLE.ADMIN.value))
			hasSubjectFetched.current = true
		}
	}, [paramSubjectId, subject])

	useEffect(() => {
		const hasAnswersWithCorrectFlag = quiz?.quizQuestions?.some((q) =>
			q?.question?.answers?.some((a) => typeof a?.isCorrect === 'boolean')
		)
		if (!hasQuizFetched.current && (!quiz || !hasAnswersWithCorrectFlag)) {
			dispatch(getQuizDetails({ id: quizId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate, ROLE.ADMIN.value))
			hasQuizFetched.current = true
		}
	}, [quizId, quiz])

	useEffect(() => {
		const breadcrumbs = [BREADCRUMB.ADMIN]

		if (subject?.id && subject?.title) {
			breadcrumbs.push(BREADCRUMB.ADMIN_SUBJECTS)
			breadcrumbs.push({
				link: ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', subject.id),
				title: subject.title,
			})
		} else {
			breadcrumbs.push(BREADCRUMB.ADMIN_QUIZZES)
		}

		setBreadcrumbs(breadcrumbs)
	}, [subject])

	return (
		<>
			<PageMeta
				title="Chi tiết bài thi | Bảng điều khiển Quản trị – Quiz App"
				description="Xem thông tin chi tiết về bài thi, bao gồm tiêu đề, mô tả, thời gian thi và điểm số. Trang quản trị của hệ thống Quiz App, xây dựng bằng React và Tailwind CSS."
			/>
			<PageBreadcrumb breadcrumbs={breadcrumbs} pageTitle={PAGE_TITLES.QUIZ_DETAILS} />
			{quiz && (
				<div className="mt-6 space-y-6">
					<QuizMetaCard quizId={quizId} />
					<ExcelQuizImporter subjectId={subjectId} quizId={quizId} />
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<QuizQuestionsCard subjectId={subjectId} quizId={quizId} verticalScroll={true} />
						<SubjectQuestionsCard subjectId={subjectId} quizId={quizId} verticalScroll={true} />
						<div className="col-span-1 lg:col-span-2">
							{isSurvey ? (
								<ComponentCard title="Danh sách thống kê" desc={`Xem lại thống kê khảo sát`}>
									<SurveyResponses quizId={quizId} />
								</ComponentCard>
							) : (
								<ComponentCard
									title="Danh sách bài thi"
									desc={`Xem lại danh sách các ${getQuizTypeLabel(
										quiz?.type
									).toLowerCase()} mà học viên đã nộp lên`}
								>
									<AllQuizResultsTable quizId={quizId} />
								</ComponentCard>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default AdminQuizDetails
