import { Fragment } from 'react'

import { useLocalQuery } from '@/hooks'
import { Spinner, FilterRenderer, PaginationControls } from '@/components'

const DataList = ({
	columns,
	itemRender,
	data,
	isLoading,
	query,
	setQuery,
	totalPages,
	simplePaging = false,
	filterSize = 'sm',
	layout = 'grid',
}) => {
	const { localQuery, setLocalSearch, page, limit } = useLocalQuery(
		columns,
		query,
		setQuery
	)

	const layoutClasses = {
		grid: 'grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4',
		row: 'space-y-4 divide-y divide-gray-300',
	}
	const layoutItemClasses = {
		grid: 'rounded-lg overflow-hidden border-gray-300 bg-gray-100 dark:bg-white/[0.03]',
		row: 'pb-4',
	}

	const isSearching = columns.some((col) => {
		const keysToCheck = col.filterBy || [col.accessorKey]

		return keysToCheck.some((key) => {
			const queryValue = localQuery[key]
			return typeof queryValue === 'object' && queryValue?.filter?.trim() !== ''
		})
	})

	return (
		<>
			<div className="flex flex-col gap-4">
				{(data.length > 0 || isSearching) && (
					<div className="round flex flex-row flex-wrap gap-2">
						{columns.map((col) => (
							<div
								key={col.accessorKey}
								className={`flex flex-col ${col.headerClassName || ''}`}
							>
								<FilterRenderer
									col={col}
									localQuery={localQuery}
									setLocalSearch={setLocalSearch}
									size={filterSize}
								/>
							</div>
						))}
					</div>
				)}

				{isLoading ? (
					<div className="text-center px-3 py-2">
						<div className="flex flex-col items-center justify-center gap-2">
							<Spinner />
							<p>Đang tải dữ liệu...</p>
						</div>
					</div>
				) : data.length === 0 ? (
					<div className="text-center px-3 py-2">
						<p>Không có dữ liệu</p>
					</div>
				) : (
					<div className={layoutClasses[layout]}>
						{data.map((row, rowIndex) => (
							<Fragment key={row.id || row.slug || rowIndex}>
								<div className={layoutItemClasses[layout]}>
									{itemRender && itemRender(row)}
								</div>
							</Fragment>
						))}
					</div>
				)}
			</div>

			<PaginationControls
				page={page}
				totalPages={totalPages}
				limit={limit}
				simplePaging={simplePaging}
				setLocalSearch={setLocalSearch}
			/>
		</>
	)
}

export default DataList
