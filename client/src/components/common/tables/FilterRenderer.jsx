import { FILTER_TYPE } from '@/constants'
import { Input, Select, DateRangePicker } from '@/components'

const FilterRenderer = ({ col, localQuery, setLocalSearch, size = 'sm' }) => {
	if (col.filter === false) return
	const filterPlaceholder = col.filterPlaceholder || `Lọc theo ${col.header.toLowerCase()}` || ''

	switch (col.filter) {
		case FILTER_TYPE.SELECT:
			if (!col.filterOptions.length) return
			return (
				<Select
					name={`filter-${col.accessorKey}`}
					placeholder={filterPlaceholder}
					options={col.filterOptions}
					onChange={(value) => setLocalSearch(col.accessorKey, value)}
					size={size}
					allowReset={true}
				/>
			)

		case FILTER_TYPE.DATETIME:
			return (
				<DateRangePicker
					name={`filter-${col.accessorKey}`}
					placeholder={filterPlaceholder}
					onChange={(value) => setLocalSearch(col.accessorKey, value)}
					size={size}
				/>
			)

		case FILTER_TYPE.NUMBER:
			return (
				<Input
					name={`filter-${col.accessorKey}`}
					type="number"
					placeholder={filterPlaceholder}
					value={localQuery?.[col.accessorKey]?.filter || ''}
					onChange={(e) => setLocalSearch(col.accessorKey, e.target.value)}
					size={size}
				/>
			)

		case FILTER_TYPE.TEXT:
		default:
			return (
				<Input
					name={`filter-${col.accessorKey}`}
					type="text"
					placeholder={filterPlaceholder}
					value={localQuery?.[col.accessorKey]?.filter || ''}
					onChange={(e) => setLocalSearch(col.accessorKey, e.target.value)}
					size={size}
				/>
			)
	}
}

export default FilterRenderer
