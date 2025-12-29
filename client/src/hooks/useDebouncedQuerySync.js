import { useEffect, useMemo } from 'react'
import { debounce, isEqual } from 'lodash'

import { normalizeQuery } from '@/utils'

export const useDebouncedQuerySync = (localQuery, query, setQuery, delay = 500) => {
	const debouncedSetQuery = useMemo(() => debounce(setQuery, delay), [setQuery])

	useEffect(() => {
		const normalizedLocal = normalizeQuery(localQuery)
		const normalizedQuery = normalizeQuery(query)

		if (!isEqual(normalizedLocal, normalizedQuery)) {
			debouncedSetQuery(localQuery)
		}
	}, [localQuery, query, debouncedSetQuery])
}
