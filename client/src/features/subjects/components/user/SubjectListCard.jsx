import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { QUERY_DEFAULT, ROUTES } from '@/constants'
import { useFilteredPagination, useInitialFetch } from '@/hooks'
import { getSubjects } from '@/features'
import { DataList } from '@/components'

const SubjectListCard = () => {
	const subjects = useSelector((state) => state.subjects)

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Môn học',
				filterBy: ['title', 'description'],
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
			},
		]
	}, [])
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const subjectList = subjects.list || []
	const { filteredData: filteredSubjects, totalPages } = useFilteredPagination(
		subjectList,
		columns,
		localQuery
	)

	useInitialFetch(subjects.list, getSubjects)

	const subjectItemRender = (subject) => {
		return (
			<div className="flex flex-col items-center gap-3 overflow-hidden">
				<div className="w-full h-[240px]">
					<Link to={ROUTES.SUBJECT_DETAILS.replace(':slug', subject.slug)}>
						<img
							src={subject.image.url}
							alt={subject.title}
							className="w-full h-full object-cover"
						/>
					</Link>
				</div>
				<div className="w-full p-4 flex flex-col gap-2">
					<Link to={ROUTES.SUBJECT_DETAILS.replace(':slug', subject.slug)}>
						<h3 className="inline-block font-medium text-brand-500 dark:text-brand-400 text-theme-xl">
							{subject.title}
						</h3>
					</Link>
					<Link to={ROUTES.SUBJECT_DETAILS.replace(':slug', subject.slug)}>
						<p className="line-clamp-3 text-gray-800 dark:text-white/90 text-theme-sm">{subject.description}</p>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-col gap-4">
				<h1>Danh sách các môn học</h1>
				<DataList
					columns={columns}
					itemRender={subjectItemRender}
					data={filteredSubjects}
					totalPages={totalPages}
					isLoading={filteredSubjects.length === 0 && subjects.isLoading}
					query={localQuery}
					setQuery={setLocalQuery}
					filterSize="md"
				/>
			</div>
		</>
	)
}

export default SubjectListCard
