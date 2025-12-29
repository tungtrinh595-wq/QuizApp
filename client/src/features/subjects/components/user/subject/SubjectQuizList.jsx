import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ROUTES, QUIZ_TYPE, FILTER_TYPE, QUERY_DEFAULT } from '@/constants'
import { formatDate } from '@/utils'
import { useFilteredPagination } from '@/hooks'
import { DataList, QuizTypeBadge } from '@/components'

const SubjectQuizList = ({ subjectId }) => {
	const subjects = useSelector((state) => state.subjects)
	const subject = subjectId ? subjects.subjectMap?.[subjectId] : null

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'title',
				header: 'Bài thi',
				filterBy: ['title', 'description'],
				bodyClassName:
					'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
			},
			{
				accessorKey: 'type',
				header: 'Loại kỳ thi',
				headerClassName: 'min-w-2.5',
				filter: FILTER_TYPE.SELECT,
				filterOptions: Object.values(QUIZ_TYPE),
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
			},
		]
	}, [])
	const quizzes = subject?.quizzes || []
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredQuizzes, totalPages } = useFilteredPagination(
		quizzes,
		columns,
		localQuery
	)

	const subjectItemRender = (quiz) => {
		const isQuiz =
			quiz?.type && [QUIZ_TYPE.EXAM.value, QUIZ_TYPE.PRACTICE.value].includes(quiz.type)
		return (
			<div className="flex flex-col items-center gap-3 overflow-hidden">
				<div className="w-full h-[240px]">
					<Link to={ROUTES.QUIZ_DETAILS.replace(':slug', quiz.slug)}>
						<img src={quiz.image.url} alt={quiz.title} className="w-full h-full object-cover" />
					</Link>
				</div>
				<div className="w-full p-4 flex flex-col gap-2">
					<Link to={ROUTES.QUIZ_DETAILS.replace(':slug', quiz.slug)}>
						<h3 className="inline-block font-medium text-brand-500 text-theme-xl">{quiz.title}</h3>
					</Link>
					<div className="flex flex-col gap-2">
						<QuizTypeBadge type={quiz.type} />
						<p className="line-clamp-3 text-gray-800 dark:text-white/90 text-theme-sm">
							{quiz.description}
						</p>
						{isQuiz && (quiz?.timeStart || quiz?.timeLimit) && (
							<div className="w-full text-left mt-2">
								{isQuiz && quiz?.timeStart && (
									<p>
										Thời gian bắt đầu: <b>{formatDate(quiz.timeStart)}</b>
									</p>
								)}
								{isQuiz && quiz?.timeLimit && (
									<p>
										Giới hạn thời gian: <b>{quiz.timeLimit} phút</b>
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<h1>Danh sách các bài kiểm tra</h1>
			<DataList
				columns={columns}
				itemRender={subjectItemRender}
				data={filteredQuizzes}
				totalPages={totalPages}
				isLoading={filteredQuizzes.length === 0 && subjects.isLoading}
				query={localQuery}
				setQuery={setLocalQuery}
				filterSize="md"
			/>
		</div>
	)
}

export default SubjectQuizList
