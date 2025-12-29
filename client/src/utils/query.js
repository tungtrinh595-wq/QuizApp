export const normalizeQuery = (query) => {
	const clean = {}
	for (const key in query) {
		const value = query[key]
		if (value === undefined || (typeof value === 'object' && !value?.filter && !value?.startDate)) {
			continue
		}
		clean[key] = value
	}
	return clean
}

export const buildLocalQueryParams = (columns, localQuery, key, value) => {
	const filterValue =
		typeof value === 'string'
			? value.trim()
			: value?.startDate instanceof Date
			? normalizeDateRange(value)
			: value
	const isFilterColumn = columns.some((col) => col.accessorKey === key)
	const shouldResetPage = key === 'limit' || isFilterColumn

	if (!filterValue || (typeof filterValue === 'object' && !filterValue.startDate)) {
		const { [key]: _, ...rest } = localQuery
		return { ...rest, page: 1 }
	}

	return {
		...localQuery,
		...(shouldResetPage ? { page: 1 } : {}),
		[key]: isFilterColumn ? { ...localQuery[key], filter: filterValue } : filterValue,
	}
}

export const flattenQueryObject = (query) => {
	const flat = {}

	Object.entries(query).forEach(([key, value]) => {
		if (value?.filter && typeof value.filter === 'object' && !Array.isArray(value.filter)) {
			Object.entries(value.filter).forEach(([subKey, subValue]) => {
				flat[`${key}.${subKey}`] = subValue
			})
		} else if (value?.filter !== undefined) {
			flat[key] = value.filter
		} else if (value !== undefined) {
			flat[key] = value
		}
	})

	return flat
}
