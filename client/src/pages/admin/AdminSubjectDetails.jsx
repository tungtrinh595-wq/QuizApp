import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { BREADCRUMB, PAGE_TITLES, PREFIX, ROLE } from '@/constants'
import { handleError } from '@/utils'
import {
	getSubjectDetails,
	SubjectMetaCard,
	SubjectQuizsCard,
	SubjectLessonsCard,
} from '@/features'
import { PageMeta, PageBreadcrumb } from '@/components'

const AdminSubjectDetails = () => {
	const navigate = useNavigate()
	const hasFetched = useRef(false)
	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const { id: subjectId } = useParams()
	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null

	useEffect(() => {
		if (!hasFetched.current && subjectId && !subject) {
			dispatch(getSubjectDetails({ id: subjectId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate, ROLE.ADMIN.value))
			hasFetched.current = true
		}
	}, [subjectId, subject])

	return (
		<>
			<PageMeta
				title="Chi tiết môn học | Bảng điều khiển Quản trị – Quiz App"
				description="Xem thông tin chi tiết về môn học, bao gồm mô tả, người tạo, thời điểm tạo và các hành động quản lý. Trang quản trị của hệ thống Quiz App, xây dựng bằng React và Tailwind CSS."
			/>
			<PageBreadcrumb
				breadcrumbs={[BREADCRUMB.ADMIN, BREADCRUMB.ADMIN_SUBJECTS]}
				pageTitle={PAGE_TITLES.SUBJECT_DETAILS}
			/>

			{subject && (
				<div className="mt-6 space-y-6">
					<SubjectMetaCard subjectId={subjectId} />
					<SubjectLessonsCard subjectId={subjectId} />
					<SubjectQuizsCard subjectId={subjectId} />
				</div>
			)}
		</>
	)
}

export default AdminSubjectDetails
