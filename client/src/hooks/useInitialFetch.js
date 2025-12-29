import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { PREFIX } from '@/constants'
import { handleError } from '@/utils'

export const useInitialFetch = (dataList, actionThunk, params) => {
	const dispatch = useDispatch()
	const hasFetched = useRef(false)

	useEffect(() => {
		if (!hasFetched.current && !Array.isArray(dataList)) {
			hasFetched.current = true
			const thunk = params ? actionThunk(params) : actionThunk()
			dispatch(thunk)
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
		}
	}, [dataList, actionThunk, dispatch, params])
}
