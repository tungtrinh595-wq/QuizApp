import { createAsyncThunk } from '@reduxjs/toolkit'

import { QUERY_DEFAULT } from '@/constants'
import { api } from '@/apis'
import { attachTokenToHeaders, flattenQueryObject } from '@/utils'
import { updateQuiz } from '@/features/quizzes'

// Admin Thunks
export const getQuizResults = createAsyncThunk(
	'results/getQuizResults',
	async ({ quizId, query }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const queryRequest = query || QUERY_DEFAULT
			options.params = flattenQueryObject(queryRequest)
			const response = await api.get(`/api/admin/results/quiz/${quizId}`, options)
			const { results, page, limit, total, totalPages } = response.data
			return {
				quizId,
				results,
				page,
				limit,
				total,
				totalPages,
			}
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getUserResults = createAsyncThunk(
	'results/getUserResults',
	async ({ userId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/results/user/${userId}`, options)
			const { results } = response.data
			return { userId, results }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getAllQuizResults = createAsyncThunk(
	'results/getAllQuizResults',
	async ({ quizId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/results/quiz/${quizId}/all`, options)
			const { results, total } = response.data
			return {
				quizId,
				results,
				total,
			}
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getResultDetails = createAsyncThunk(
	'results/getResultDetails',
	async ({ id }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/results/${id}`, options)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

// User Thunks
export const getQuizResult = createAsyncThunk(
	'results/getQuizResult',
	async ({ quizId }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/results/quiz/${quizId}`, options)
			const { result, quiz } = response.data

			if (quiz) dispatch(updateQuiz({ quiz }))
			localStorage.removeItem('doingQuiz')
			return { quizId, result }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const submitQuiz = createAsyncThunk(
	'results/submitQuiz',
	async ({ quizId, formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/results/quiz/${quizId}`, formData, options)
			const { result, quiz } = response.data

			if (quiz) dispatch(updateQuiz({ quiz }))
			localStorage.removeItem('doingQuiz')
			return { quizId, result }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getMyResults = createAsyncThunk(
	'results/getMyResults',
	async ({ userId }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/results`, options)
			const { results } = response.data
			return { userId, results }
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)
