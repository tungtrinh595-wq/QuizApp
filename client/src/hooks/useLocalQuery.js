import { useState } from 'react'

import { buildLocalQueryParams } from '@/utils'
import { useDebouncedQuerySync } from '@/hooks'
import { QUERY_DEFAULT, LIMIT_QUERY_DEFAULT } from '@/constants'

export const useLocalQuery = (columns, query, setQuery) => {
	const [localQuery, setLocalQuery] = useState(() => query || QUERY_DEFAULT)
	const page = localQuery?.page || 1
	const limit = localQuery?.limit || LIMIT_QUERY_DEFAULT

	const setLocalSearch = (key, value) => {
		const localQueryParams = buildLocalQueryParams(columns, localQuery, key, value)
		setLocalQuery(localQueryParams)
	}

	useDebouncedQuerySync(localQuery, query, setQuery)

	return { localQuery, setLocalQuery, setLocalSearch, page, limit }
}
