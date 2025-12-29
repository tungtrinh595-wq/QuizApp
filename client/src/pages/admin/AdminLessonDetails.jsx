import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PAGE_TITLES, BREADCRUMB, ROUTES, ROLE, PREFIX } from '@/constants'
import { handleError } from '@/utils'
import { getLessonDetails, LessonMetaCard, LessonFilesCard, getSubjectDetails } from '@/features'
import { PageMeta, PageBreadcrumb } from '@/components'

const AdminLessonDetails = () => {
	const navigate = useNavigate()
	const hasLessonFetched = useRef(false)
	const hasSubjectFetched = useRef(false)
	const { id: lessonId, subjectId } = useParams()

	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const lessons = useSelector((state) => state.lessons)

	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null
	const lesson = lessonId ? lessons.lessonMap?.[lessonId] : null

	const [breadcrumbs, setBreadcrumbs] = useState([BREADCRUMB.ADMIN])

	useEffect(() => {
		if (!hasSubjectFetched.current && subjectId && !subject) {
			dispatch(getSubjectDetails({ id: subjectId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate, ROLE.ADMIN.value))
			hasSubjectFetched.current = true
		}
	}, [subjectId, subject])

	useEffect(() => {
		if (!hasLessonFetched.current && !lesson) {
			dispatch(getLessonDetails({ id: lessonId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate, ROLE.ADMIN.value))

			hasLessonFetched.current = true
		}
	}, [lessonId, lesson])

	useEffect(() => {
		const breadcrumbs = [BREADCRUMB.ADMIN]

		if (subject?.id && subject?.title) {
			breadcrumbs.push(BREADCRUMB.ADMIN_SUBJECTS)
			breadcrumbs.push({
				link: ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', subject.id),
				title: subject.title,
			})
		} else {
			breadcrumbs.push(BREADCRUMB.ADMIN_LESSONS)
		}

		setBreadcrumbs(breadcrumbs)
	}, [subject])

	return (
		<>
			<PageMeta
				title="Chi tiết bài học | Bảng điều khiển Quản trị – Quiz App"
				description="Truy cập nội dung bài học. Trang quản trị của hệ thống Quiz App, xây dựng bằng React và Tailwind CSS."
			/>
			<PageBreadcrumb breadcrumbs={breadcrumbs} pageTitle={PAGE_TITLES.LESSON_DETAILS} />

			{lesson && (
				<div className="mt-6 space-y-6">
					<LessonMetaCard lessonId={lessonId} />
					<LessonFilesCard lessonId={lessonId} />
				</div>
			)}
		</>
	)
}

export default AdminLessonDetails
