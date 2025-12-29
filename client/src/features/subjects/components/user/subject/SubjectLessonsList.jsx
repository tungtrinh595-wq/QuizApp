import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ROUTES, LESSON_STATUS, QUERY_DEFAULT } from '@/constants'
import { useFilteredPagination } from '@/hooks'
import { DataList } from '@/components'

const SubjectLessonsList = ({ subjectId }) => {
	const subjects = useSelector((state) => state.subjects)

	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null
	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Bài học',
				filterBy: ['title', 'description'],
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
			},
		]
	}, [])
	const lessons = subject?.lessons.filter((l) => l.status === LESSON_STATUS.PUBLISHED.value) || []
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredLessons, totalPages } = useFilteredPagination(
		lessons,
		columns,
		localQuery
	)

	const subjectItemRender = (lesson) => {
		return (
			<div className="flex flex-col items-center gap-3 overflow-hidden">
				<div className="w-full h-[240px]">
					<Link to={ROUTES.LESSON_DETAILS.replace(':slug', lesson.slug)}>
						<img src={lesson.image.url} alt={lesson.title} className="w-full h-full object-cover" />
					</Link>
				</div>
				<div className="w-full p-4 flex flex-col gap-2">
					<Link to={ROUTES.LESSON_DETAILS.replace(':slug', lesson.slug)}>
						<h3 className="inline-block font-medium text-brand-500 text-theme-xl">
							{lesson.title}
						</h3>
					</Link>
					<Link to={ROUTES.LESSON_DETAILS.replace(':slug', lesson.slug)}>
						<p className="line-clamp-3 text-gray-800 dark:text-white/90 text-theme-sm">{lesson.description}</p>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<h1>Danh sách bài học</h1>
			<DataList
				columns={columns}
				itemRender={subjectItemRender}
				data={filteredLessons}
				totalPages={totalPages}
				isLoading={filteredLessons.length === 0 && subjects.isLoading}
				query={localQuery}
				setQuery={setLocalQuery}
				filterSize="md"
			/>
		</div>
	)
}

export default SubjectLessonsList
