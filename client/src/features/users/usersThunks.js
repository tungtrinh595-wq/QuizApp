import { createAsyncThunk } from '@reduxjs/toolkit'

import { HTTP_STATUS } from '@/constants'
import { api } from '@/apis'
import { attachTokenToHeaders, flattenQueryObject } from '@/utils'
import { loadMe, logout, loginWithOauth, setAuthUser } from '@/features/auth'

// Admin Thunks
export const getUsers = createAsyncThunk(
	'users/getUsers',
	async ({ queryRequest } = {}, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			if (queryRequest) options.params = flattenQueryObject(queryRequest)
			const response = await api.get('/api/admin/users', options)
			const { users } = response.data
			const profiles = {}
			users.forEach((u) => {
				profiles[u.id] = u
			})

			return {
				profiles,
				users,
				page: response.data.page,
				limit: response.data.limit,
				total: response.data.total,
				totalPages: response.data.totalPages,
			}
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const getProfile = createAsyncThunk(
	'users/getProfile',
	async ({ slug }, { getState, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get(`/api/admin/users/slug/${slug}`, options)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const changeUserPassword = createAsyncThunk(
	'users/changeUserPassword',
	async ({ id, formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/users/change-password/${id}`, formData, options)
			const { user } = response.data

			if (getState().auth.me?.id === user?.id) {
				dispatch(setAuthUser({ me: user }))
			}
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const setUserPassword = createAsyncThunk(
	'users/setUserPassword',
	async ({ id, formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/users/set-password/${id}`, formData, options)
			const { user } = response.data

			if (getState().auth.me?.id === user?.id) {
				dispatch(setAuthUser({ me: user }))
			}

			const users = getState().users.list
			if (users) {
				const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, ...user } : u))
				return { user, updatedUsers }
			}
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const addUser = createAsyncThunk(
	'users/addUser',
	async ({ formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.post(`/api/admin/users`, formData, options)

			if (getState().users.total > 0) {
				const currentQuery = { ...getState().users.query }
				await dispatch(getUsers({ queryRequest: currentQuery }))
			}
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const editUser = createAsyncThunk(
	'users/editUser',
	async ({ id, formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put(`/api/admin/users/${id}`, formData, options)
			const { user } = response.data

			if (getState().auth.me?.id === user?.id) {
				dispatch(setAuthUser({ me: user }))
			}
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const deleteUser = createAsyncThunk(
	'users/deleteUser',
	async ({ id }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.delete(`/api/admin/users/${id}`, options)

			if (response.status === HTTP_STATUS.NO_CONTENT) {
				if (getState().users.total > 0) {
					const currentQuery = { ...getState().users.query }
					await dispatch(getUsers({ queryRequest: currentQuery }))
				}

				if (getState().auth.me?.id === id) {
					dispatch(clearAuth())
				}

				return { id }
			}
			return rejectWithValue({ message: 'Trạng thái phản hồi không mong đợi' })
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

// User Thunks
export const editProfile = createAsyncThunk(
	'users/editProfile',
	async ({ formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put('/api/users/', formData, options)
			const { user } = response.data

			if (getState().auth.me?.id === user?.id) {
				dispatch(setAuthUser({ me: user }))
			}
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const changePassword = createAsyncThunk(
	'users/changePassword',
	async ({ formData }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.put('/api/users/change-password/', formData, options)
			const { user } = response.data

			if (getState().auth.me?.id === user?.id) {
				dispatch(setAuthUser({ me: user }))
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const setPassword = createAsyncThunk(
	'users/setPassword',
	async ({ formData, authToken }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState, authToken)
			const response = await api.put('/api/users/set-password/', formData, options)
			const { user } = response.data

			if (getState().auth.me?.id === user?.id) {
				await dispatch(loadMe())
			}

			if (authToken) {
				await dispatch(loginWithOauth(authToken))
			}

			const users = getState().users.list
			if (users) {
				const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, ...user } : u))
				return { user, updatedUsers }
			}

			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)
