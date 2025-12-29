import { Fragment } from 'react'

import { useLocalQuery } from '@/hooks'
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	Spinner,
	FilterRenderer,
	PaginationControls,
} from '@/components'

const DataTable = ({
	columns,
	data,
	isLoading,
	query,
	setQuery,
	totalPages,
	simplePaging = false,
}) => {
	const { localQuery, setLocalSearch, page, limit } = useLocalQuery(columns, query, setQuery)

	return (
		<>
			<Table>
				<TableHeader className="border-b border-gray-100 dark:border-gray-700">
					<TableRow key="table-header">
						{columns.map((col) => (
							<Fragment key={col.accessorKey}>
								<TableCell
									isHeader
									className={`px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs ${
										col.headerClassName || ''
									}`}
								>
									<div className="flex flex-col gap-2">
										<span className="whitespace-nowrap">{col.header}</span>
										<FilterRenderer
											col={col}
											localQuery={localQuery}
											setLocalSearch={setLocalSearch}
										/>
									</div>
								</TableCell>
							</Fragment>
						))}
					</TableRow>
				</TableHeader>

				<TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={columns.length} className="text-center px-3 py-2">
								<div className="flex flex-col items-center justify-center gap-2">
									<Spinner size="sm" />
									<p>Đang tải dữ liệu...</p>
								</div>
							</TableCell>
						</TableRow>
					) : data.length === 0 ? (
						<TableRow>
							<TableCell colSpan={columns.length} className="text-center px-3 py-2">
								<p>Không có dữ liệu</p>
							</TableCell>
						</TableRow>
					) : (
						data?.map((row, rowIndex) => (
							<TableRow key={row.id || row.slug || rowIndex}>
								{columns.map((col, colIndex) => (
									<Fragment key={colIndex}>
										<TableCell className={col.bodyClassName || ''}>
											{col.render && col.render(row)}
										</TableCell>
									</Fragment>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

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

export default DataTable
