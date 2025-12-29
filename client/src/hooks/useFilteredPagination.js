import { useEffect, useMemo, useState } from 'react'
import { isEqual } from 'lodash'

import { LIMIT_QUERY_DEFAULT } from '@/constants'
import { getFilterConfig, filterLocalData } from '@/utils'

export const useFilteredPagination = (rawData, columns, localQuery, { quizQuestions } = {}) => {
	const [filteredData, setFilteredData] = useState([])
	const [totalPages, setTotalPages] = useState(1)

	const filterResult = useMemo(() => {
		const safeRawData = Array.isArray(rawData) ? rawData : []
		const filterConfig = getFilterConfig(columns)

		if (Array.isArray(quizQuestions) && quizQuestions.length > 0) {
			const unasignedQuestions = safeRawData.filter(
				(q) => !quizQuestions.some((qq) => qq.question.id === q.id)
			)
			return filterLocalData(unasignedQuestions, localQuery, filterConfig)
		}

		const sortedData = [...safeRawData].sort((a, b) => a.order - b.order)
		return filterLocalData(sortedData, localQuery, filterConfig)
	}, [rawData, columns, localQuery, quizQuestions])

	useEffect(() => {
		const { filteredDatas, total } = filterResult
		const safeData = Array.isArray(filteredDatas) ? filteredDatas : []
		const safeLimit = localQuery.limit === -1 ? total : localQuery.limit || LIMIT_QUERY_DEFAULT
		const newTotalPages = Math.ceil(Math.max(1, total) / safeLimit || 1)

		if (!isEqual(filteredData, safeData) || totalPages !== newTotalPages) {
			setFilteredData(safeData)
			setTotalPages(newTotalPages)
		}
	}, [filterResult, localQuery])

	return { filteredData, totalPages }
}
