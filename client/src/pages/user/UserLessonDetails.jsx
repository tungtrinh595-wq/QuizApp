import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { BREADCRUMB, PAGE_TITLES, PREFIX, ROUTES } from '@/constants'
import { handleError } from '@/utils'
import { getPublicLessonDetails, LessonMessages } from '@/features'
import {
	Banner,
	PageMeta,
	ComponentCard,
	PageBreadcrumb,
	LessonFileGrid,
	SafeHtmlContent,
} from '@/components'

const UserLessonDetails = () => {
	const navigate = useNavigate()
	const { slug } = useParams()
	const hasFetched = useRef(false)
	const dispatch = useDispatch()
	const lessons = useSelector((state) => state.lessons)
	const lessonId = Object.values(lessons.lessonMap || {}).find((l) => l.slug === slug)?.id
	const lesson = lessonId ? lessons.lessonMap?.[lessonId] : null

	useEffect(() => {
		if (!hasFetched.current && !lesson) {
			dispatch(getPublicLessonDetails({ slug }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate))
			hasFetched.current = true
		}
	}, [slug, lesson])

	return (
		<>
			<PageMeta
				title="Chi tiết bài học | Quiz App"
				description="Xem nội dung chi tiết của bài học, bao gồm tiêu đề, mô tả, nội dung bài học. Trang quản trị của hệ thống Quiz App, xây dựng bằng React và Tailwind CSS."
			/>
			<div className="flex flex-col gap-6">
				<Banner
					image={lesson?.image?.url}
					title={lesson?.title}
					description={lesson?.description}
					isLoading={lessons.isLoading}
				/>
				<div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pb-6 flex flex-col gap-6">
					{lesson && (
						<>
							<PageBreadcrumb
								breadcrumbs={[
									BREADCRUMB.HOME,
									...(slug && lesson?.subject?.title && lesson?.subject?.slug
										? [
												{
													link: ROUTES.SUBJECT_DETAILS.replace(':slug', lesson.subject.slug),
													title: lesson?.subject?.title,
												},
										  ]
										: []),
								]}
								pageTitle={lesson?.title || PAGE_TITLES.LESSON_DETAILS}
								showPageTitle={false}
							/>
							{lesson?.content && (
								<ComponentCard title="Nội dung bài học">
									<SafeHtmlContent content={lesson.content} />
								</ComponentCard>
							)}
							{lesson?.lessonFiles?.length > 0 && (
								<ComponentCard title="Các tập tin đính kèm">
									<LessonFileGrid files={lesson.lessonFiles} showDownload={true} />
								</ComponentCard>
							)}
							<LessonMessages lessonId={lessonId} />
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default UserLessonDetails
