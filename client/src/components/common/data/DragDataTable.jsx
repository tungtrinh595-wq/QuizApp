import { Fragment, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { GripVerticalIcon } from '@/assets/icons'
import { useLocalQuery } from '@/hooks'
import { Spinner, FilterRenderer, PaginationControls } from '@/components'

const DragDataTable = ({
	id = 'pangeadndDataTable',
	columns,
	data,
	isLoading = false,
	query,
	setQuery,
	totalPages = 1,
	handleSort,
	simplePaging = false,
}) => {
	const [items, setItems] = useState(data)
	const { localQuery, setLocalSearch, page, limit } = useLocalQuery(
		columns,
		query,
		setQuery
	)

	const handleDragEnd = (result) => {
		if (!result.destination) return

		const newItems = Array.from(items)
		const [moved] = newItems.splice(result.source.index, 1)
		newItems.splice(result.destination.index, 0, moved)

		setItems(newItems)

		const newOrderList = newItems.map((item, index) => ({
			id: item.id,
			order: index + 1,
		}))
		const submitOrderList = newOrderList.filter((item) => {
			const matched = data.find((dataItem) => dataItem.id === item.id)
			return matched && matched.order !== item.order
		})
		if (submitOrderList.length > 0) {
			handleSort(submitOrderList)
		}
	}

	useEffect(() => {
		if (Array.isArray(data)) {
			const newData = [...data].sort((a, b) => {
				const orderA = typeof a.order === 'number' ? a.order : Infinity
				const orderB = typeof b.order === 'number' ? b.order : Infinity
				return orderA - orderB
			})
			setItems(newData)
		}
	}, [data])

	return (
		<>
			<table className="min-w-full">
				<thead className="border-b border-gray-100 dark:border-gray-700">
					<tr key="table-header">
						{columns.map((col) => (
							<Fragment key={col.accessorKey}>
								<th
									className={`px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs ${col.headerClassName}`}
								>
									<div className="flex flex-col gap-2">
										<span className="whitespace-nowrap">{col.header}</span>
										<FilterRenderer
											col={col}
											localQuery={localQuery}
											setLocalSearch={setLocalSearch}
										/>
									</div>
								</th>
							</Fragment>
						))}
					</tr>
				</thead>

				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId={id}>
						{(provided) => (
							<tbody
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="divide-y divide-gray-100 dark:divide-gray-700"
							>
								{isLoading ? (
									<tr>
										<td
											colSpan={columns.length}
											className="text-center px-3 py-2"
										>
											<div className="flex flex-col items-center justify-center gap-2">
												<Spinner size="sm" />
												<p>Đang tải dữ liệu...</p>
											</div>
										</td>
									</tr>
								) : items.length === 0 ? (
									<tr>
										<td
											colSpan={columns.length}
											className="text-center px-3 py-2"
										>
											<p>Không có dữ liệu</p>
										</td>
									</tr>
								) : (
									items?.map((row, rowIndex) => (
										<Draggable
											key={row.id}
											draggableId={row.id}
											index={rowIndex}
										>
											{(provided) => (
												<tr
													key={row.id || row.slug || rowIndex}
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													{columns.map((col, colIndex) => (
														<Fragment key={colIndex}>
															<td className={col.bodyClassName || ''}>
																{colIndex === 0 ? (
																	<div className="flex flex-row items-stretch gap-2">
																		<div className="flex items-center p-1">
																			<GripVerticalIcon className="size-2.5 fill-gray-500" />
																		</div>
																		<div className="flex-1">
																			{col.render && col.render(row)}
																		</div>
																	</div>
																) : (
																	<>{col.render && col.render(row)}</>
																)}
															</td>
														</Fragment>
													))}
												</tr>
											)}
										</Draggable>
									))
								)}
								{provided.placeholder}
							</tbody>
						)}
					</Droppable>
				</DragDropContext>
			</table>

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

export default DragDataTable
