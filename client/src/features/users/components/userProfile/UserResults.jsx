import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { FILTER_TYPE, QUERY_DEFAULT, QUIZ_TYPE, ROLE, ROUTES } from '@/constants'
import { EyeIcon } from '@/assets/icons'
import { formatDate } from '@/utils'
import { useFilteredPagination, useInitialFetch, useModal } from '@/hooks'
import { getMyResults, getUserResults, ResultDetails } from '@/features'
import {
	Modal,
	Button,
	DataTable,
	QuizTypeBadge,
	ComponentCard,
	AchievedIndicator,
} from '@/components'

const UserResults = ({ userId }) => {
	const auth = useSelector((state) => state.auth)
	const results = useSelector((state) => state.results)
	const [selectedResult, setSelectedResult] = useState()
	const { isOpen, openModal, closeModal } = useModal()
	const userResults = results.userResultsMap?.[userId]
	const isSurvey = selectedResult?.quiz?.type === QUIZ_TYPE.SURVEY.value
	const isAdmin = auth.me?.role === ROLE.ADMIN.value

	const handleShowResultDetails = (result) => {
		setSelectedResult(result)
		openModal()
	}

	const columns = useMemo(() => {
		return [
			{
				accessorKey: 'quiz',
				header: 'Bài thi',
				filterBy: ['quiz.title'],
				bodyClassName:
					'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
				render: (result) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-full">
							<Link
								to={
									isAdmin
										? ROUTES.ADMIN.QUIZ_DETAILS.replace(':id', result.quiz?.id)
										: ROUTES.QUIZ_DETAILS.replace(':slug', result.quiz?.slug)
								}
							>
								<img
									width={40}
									height={40}
									src={result.quiz?.image?.url}
									alt={result.quiz?.title}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link
								to={
									isAdmin
										? ROUTES.ADMIN.QUIZ_DETAILS.replace(':id', result.quiz?.id)
										: ROUTES.QUIZ_DETAILS.replace(':slug', result.quiz?.slug)
								}
							>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{result.quiz?.title}
								</span>
							</Link>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'subject',
				header: 'Môn học',
				filterBy: ['quiz.subject.title'],
				bodyClassName:
					'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
				render: (result) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 overflow-hidden rounded-full">
							<Link
								to={
									isAdmin
										? ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', result.quiz?.subject?.id)
										: ROUTES.SUBJECT_DETAILS.replace(':slug', result.quiz?.subject?.slug)
								}
							>
								<img
									width={40}
									height={40}
									src={result.quiz?.subject?.image?.url}
									alt={result.quiz?.subject?.title}
									className="w-full h-full object-cover"
								/>
							</Link>
						</div>
						<div className="flex-1">
							<Link
								to={
									isAdmin
										? ROUTES.ADMIN.SUBJECT_DETAILS.replace(':id', result.quiz?.subject?.id)
										: ROUTES.SUBJECT_DETAILS.replace(':slug', result.quiz?.subject?.slug)
								}
							>
								<span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
									{result.quiz?.subject?.title}
								</span>
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
			{
				accessorKey: 'type',
				header: 'Loại bài thi',
				headerClassName: 'whitespace-nowrap min-w-[120px]',
				filter: FILTER_TYPE.SELECT,
				filterBy: ['quiz.type'],
				filterOptions: Object.values(QUIZ_TYPE),
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm',
				render: (result) => <QuizTypeBadge type={result.quiz?.type} />,
			},
			{
				accessorKey: 'score',
				header: 'Điểm số',
				bodyClassName:
					'px-4 py-3 text-gray-500 dark:text-gray-400 text-start min-w-[200px] text-theme-sm',
				render: (result) => {
					if (result.quiz?.type === QUIZ_TYPE.SURVEY.value) return null

					return (
						<div className="flex flex-wrap items-center justify-center gap-2">
							<p>
								{result.score} / {result.totalScore}
							</p>
							<AchievedIndicator isPass={result.score >= result.quiz?.passScore} />
						</div>
					)
				},
			},
			{
				accessorKey: 'actions',
				header: '',
				filter: false,
				bodyClassName: 'px-4 py-3 text-gray-500 dark:text-gray-400 text-theme-sm',
				render: (result) => (
					<div className="flex flex-1 flex-col w-full items-center gap-2 xl:flex-row">
						{isAdmin ? (
							<Button
								size="xs"
								variant="roundGroup"
								color="neutral"
								startIcon={<EyeIcon className="fill-gray-500 size-5" />}
								onClick={() => handleShowResultDetails(result)}
							>
								Xem chi tiết
							</Button>
						) : (
							<Link to={ROUTES.QUIZ_DETAILS.replace(':slug', result.quiz?.slug)}>
								<Button
									size="xs"
									variant="roundGroup"
									color="neutral"
									startIcon={<EyeIcon className="fill-gray-500 size-5" />}
								>
									Xem chi tiết
								</Button>
							</Link>
						)}
					</div>
				),
			},
		]
	}, [userResults?.list])

	const resultList = userResults?.list || []
	const [localQuery, setLocalQuery] = useState(QUERY_DEFAULT)
	const { filteredData: filteredResults, totalPages } = useFilteredPagination(
		resultList,
		columns,
		localQuery
	)

	const actionThunk = isAdmin ? getUserResults : getMyResults
	useInitialFetch(userResults?.list, actionThunk, { userId })

	return (
		<>
			<ComponentCard
				title="Kết quả thi của học viên"
				desc={`Xem lại danh sách các bài thi hoặc bài khảo sát mà học viên đã nộp lên`}
			>
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-700">
					<div className="max-w-full overflow-x-auto">
						{userResults && (
							<DataTable
								columns={columns}
								data={filteredResults}
								totalPages={totalPages}
								isLoading={filteredResults.length === 0 && userResults.isLoading}
								query={userResults.query}
								setQuery={setLocalQuery}
							/>
						)}
					</div>
				</div>
			</ComponentCard>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							{isSurvey ? 'Chi tiết phản hồi khảo sát' : 'Chi tiết kết quả bài thi'}
						</h4>
					</div>
					<ResultDetails
						quizId={selectedResult?.quiz?.id}
						resultId={selectedResult?.id}
						closeModal={closeModal}
					/>
				</div>
			</Modal>
		</>
	)
}

export default UserResults
