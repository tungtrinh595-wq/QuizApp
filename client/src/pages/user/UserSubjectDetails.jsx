import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { BREADCRUMB, PAGE_TITLES, PREFIX } from '@/constants'
import { getSubjectDetailsBySlug, SubjectQuizList, SubjectLessonsList } from '@/features'
import { Banner, PageMeta, PageBreadcrumb } from '@/components'
import { handleError } from '@/utils'

const UserSubjectDetails = () => {
	const navigate = useNavigate()
	const { slug } = useParams()
	const hasFetched = useRef(false)
	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const subjectId = Object.values(subjects.subjectMap || {}).find((s) => s.slug === slug)?.id
	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null

	useEffect(() => {
		if (!hasFetched.current && !subject) {
			dispatch(getSubjectDetailsBySlug({ slug }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate))
			hasFetched.current = true
		}
	}, [slug, subject])

	return (
		<>
			<PageMeta
				title="Chi tiết môn học | Quiz App"
				description="Xem thông tin chi tiết về môn học, bao gồm mô tả, người tạo, thời điểm tạo và các hành động quản lý. Trang quản trị của hệ thống Quiz App, xây dựng bằng React và Tailwind CSS."
			/>
			<div className="flex flex-col gap-6">
				<Banner
					image={subject?.image?.url}
					title={subject?.title}
					description={subject?.description}
					isLoading={subjects.isLoading}
				/>
				<div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pb-6 flex flex-col gap-6">
					{subject && (
						<>
							<PageBreadcrumb
								breadcrumbs={[BREADCRUMB.HOME]}
								pageTitle={subject?.title || PAGE_TITLES.SUBJECT_DETAILS}
								showPageTitle={false}
							/>
							<SubjectLessonsList subjectId={subjectId} />
							<SubjectQuizList subjectId={subjectId} />
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default UserSubjectDetails
