import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

import { FILTER_TYPE, PREFIX, QUIZ_TYPE, ROUTES } from '@/constants'
import { EyeIcon } from '@/assets/icons'
import { formatDate, handleError } from '@/utils'
import { useModal } from '@/hooks'
import { getQuizResults, setResultsPrevQuery, setResultsQuery, ResultDetails } from '@/features'
import { AchievedIndicator, Button, DataTable, Modal } from '@/components'

const QuizResultsTable = ({ quizId }) => {
	const dispatch = useDispatch()
	const results = useSelector((state) => state.results)
	const quizzes = useSelector((state) => state.quizzes)
	const [selectedResultId, setSelectedResultId] = useState()
	const { isOpen, openModal, closeModal } = useModal()
	const quizResults = results.quizResultsMap?.[quizId]
	const quiz = quizzes.quizMap?.[quizId]

	const handleShowResultDetails = (result) => {
		setSelectedResultId(result.id)
		openModal()
	}

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'createdBy',
				header: 'Thí sinh',
				filterBy: ['createdBy.name', 'createdBy.email'],
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
				render: (result) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-full">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', result.createdBy?.slug)}>
								<img
									width={40}
									height={40}
									src={result.createdBy?.avatar?.url}
									alt={result.createdBy?.name}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link to={ROUTES.ADMIN.USER_DETAILS.replace(':slug', result.createdBy?.slug)}>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{result.createdBy?.name}
								</span>
								<span className="block text-gray-500 dark:text-gray-400 text-theme-xs">{result.createdBy?.email}</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'startedAt',
				header: 'Thời gian bắt đầu làm bài',
				headerClassName: 'whitespace-nowrap',
				filter: FILTER_TYPE.DATETIME,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[150px]',
				render: (result) => <div className="flex -space-x-2">{formatDate(result.startedAt)}</div>,
			},
			{
				accessorKey: 'submittedAt',
				header: 'Thời gian nộp bài',
				headerClassName: 'whitespace-nowrap',
				filter: FILTER_TYPE.DATETIME,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[150px]',
				render: (result) => <div className="flex -space-x-2">{formatDate(result.submittedAt)}</div>,
			},
			...(quiz.type !== QUIZ_TYPE.SURVEY.value
				? [
						{
							accessorKey: 'score',
							header: 'Điểm số',
							bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm min-w-[200px]',
							render: (result) => (
								<div className="flex flex-wrap items-center justify-center gap-2">
									<p>
										{result.score} / {result.totalScore}
									</p>
									<AchievedIndicator isPass={result.score >= quiz?.passScore} />
								</div>
							),
						},
				  ]
				: []),
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (result) => (
					<div className="flex flex-1 flex-col w-full items-center gap-2 xl:flex-row">
						<Button
							size="xs"
							variant="roundGroup"
							color="neutral"
							startIcon={<EyeIcon className="fill-gray-500 size-5" />}
							onClick={() => handleShowResultDetails(result)}
						>
							Xem chi tiết
						</Button>
					</div>
				),
			},
		]
	}, [quiz])

	useEffect(() => {
		const hasQueryChanged = quizResults && !isEqual(quizResults?.prevQuery, quizResults?.query)

		if (!Array.isArray(quizResults?.list) || hasQueryChanged) {
			dispatch(getQuizResults({ quizId, query: quizResults?.query }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			dispatch(setResultsPrevQuery({ quizId, query: quizResults?.query }))
		}
	}, [quizResults?.query])

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-700">
				<div className="max-w-full overflow-x-auto">
					{quizResults && (
						<DataTable
							columns={columns}
							data={quizResults.list || []}
							totalPages={quizResults.totalPages || 0}
							isLoading={quizResults.list?.length === 0 && quizResults.isLoading}
							query={quizResults.query}
							setQuery={(query) => dispatch(setResultsQuery({ quizId, query }))}
						/>
					)}
				</div>
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Chi tiết kết quả bài thi
						</h4>
					</div>
					<ResultDetails quizId={quizId} resultId={selectedResultId} closeModal={closeModal} />
				</div>
			</Modal>
		</>
	)
}

export default QuizResultsTable
