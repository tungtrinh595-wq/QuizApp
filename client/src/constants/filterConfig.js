export const LIMIT_QUERY_DEFAULT = 20
export const QUERY_DEFAULT = { page: 1, limit: LIMIT_QUERY_DEFAULT }
export const PAGE_SIZE_OPTIONS = [10, LIMIT_QUERY_DEFAULT, 30, 40, 50].sort((a, b) => a - b)

export const FILTER_TYPE = {
	TEXT: 'text',
	SELECT: 'select',
	DATETIME: 'date-time',
	NUMBER: 'number',
}

export const FILTER_COMPARE_TYPE = {
	TEXT: 'text',
	NUMBER: 'number',
	EXACT: 'exact',
	DATERANGE: 'date-range',
}

export const MAX_DEPTH = 3
