import { FILTER_TYPE, FILTER_COMPARE_TYPE, LIMIT_QUERY_DEFAULT } from '@/constants'

export const getFilterConfig = (columns) => {
	const config = {}

	columns.forEach((col) => {
		if (col.filter === false) return

		const key = col.accessorKey
		if (!key) return

		const compareType = (() => {
			switch (col.filter) {
				case FILTER_TYPE.DATETIME:
					return FILTER_COMPARE_TYPE.DATERANGE
				case FILTER_TYPE.SELECT:
					return FILTER_COMPARE_TYPE.EXACT
				case FILTER_TYPE.NUMBER:
					return FILTER_COMPARE_TYPE.NUMBER
				case FILTER_TYPE.TEXT:
				default:
					return FILTER_COMPARE_TYPE.TEXT
			}
		})()

		if (Array.isArray(col.filterBy)) {
			config[key] = {
				type: compareType,
				orFields: col.filterBy,
			}
		} else if (typeof col.filterBy === 'string') {
			config[col.filterBy] = { type: compareType }
		} else {
			config[key] = { type: compareType }
		}
	})

	return config
}

export const filterLocalData = (data, query, config) => {
	let result = [...data]

	Object.entries(config).forEach(([field, configItem]) => {
		const { type, orFields } = typeof configItem === 'object' ? configItem : { type: configItem }
		const condition = query[field]?.filter
		if (!condition) return

		switch (type) {
			case FILTER_COMPARE_TYPE.EXACT:
				result = result.filter((item) => {
					if (orFields) {
						return orFields.some((f) => getNestedValue(item, f) === condition)
					}
					return getNestedValue(item, field) === condition
				})
				break

			case FILTER_COMPARE_TYPE.DATERANGE:
				const { startDate, endDate } = condition
				const start = new Date(startDate)
				const end = new Date(endDate)
				result = result.filter((item) => {
					const date = new Date(getNestedValue(item, field))
					return date >= start && date <= end
				})
				break

			case FILTER_COMPARE_TYPE.NUMBER:
			case FILTER_COMPARE_TYPE.TEXT:
			default:
				result = result.filter((item) => {
					if (orFields) return orFields.some((f) => matchValue(getNestedValue(item, f), condition))
					return matchValue(getNestedValue(item, field), condition)
				})
				break
		}
	})

	const limit = query.limit || LIMIT_QUERY_DEFAULT
	const page = query.page || 1
	const startIndex = limit === -1 ? 0 : (page - 1) * limit
	const paginated = limit === -1 ? result : result.slice(startIndex, startIndex + limit)

	return { filteredDatas: paginated, total: result.length }
}

export const getNestedValue = (obj, path) => {
	return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export const matchValue = (value, condition) => {
	if (typeof value === 'number') return value === Number(condition)
	if (typeof value === 'string') return value.toLowerCase().includes(condition.toLowerCase())
	return false
}
