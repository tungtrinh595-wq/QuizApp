import { createAsyncThunk } from '@reduxjs/toolkit'

import { api } from '@/apis'
import { setCookie, removeToken, attachTokenToHeaders } from '@/utils'
import { cacheUserProfile } from '@/features/users'
import { setAuthUser } from '@/features/auth'
import { connectSocket } from '@/features/socket'

export const applyAuthState = (dispatch, me) => {
	dispatch(setAuthUser({ me }))
	dispatch(cacheUserProfile({ profile: me }))
}

export const loadMe = createAsyncThunk(
	'auth/loadMe',
	async (_, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState)
			const response = await api.get('/api/users/me', options)
			const { me } = response.data

			dispatch(cacheUserProfile({ profile: me }))
			return response.data
		} catch (err) {
			removeToken()
			return rejectWithValue(err)
		}
	}
)

export const loginWithOauth = createAsyncThunk(
	'auth/loginWithOauth',
	async ({ token }, { getState, dispatch, rejectWithValue }) => {
		try {
			const options = attachTokenToHeaders(getState, token)
			const response = await api.get('/api/users/me', options)
			const { me } = response.data

			dispatch(cacheUserProfile({ profile: me }))
			connectSocket(token)
			return { ...response.data, token }
		} catch (err) {
			removeToken()
			return rejectWithValue(err)
		}
	}
)

export const loginWithEmail = createAsyncThunk(
	'auth/loginWithEmail',
	async ({ formData, keepMeLogin }, { dispatch, rejectWithValue }) => {
		try {
			const response = await api.post('/auth/login', formData)
			const { me, token } = response.data

			if (keepMeLogin) {
				setCookie('token', token)
			} else {
				setCookie('token', token, 1 / 24)
				sessionStorage.setItem('token', token)
			}
			applyAuthState(dispatch, me)
			connectSocket(token)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const loginWithGoogle = createAsyncThunk(
	'auth/loginWithGoogle',
	async ({ oauthData }, { dispatch, rejectWithValue }) => {
		try {
			const response = await api.post('/auth/google', oauthData)
			const { me, token } = response.data

			setCookie('token', token)
			applyAuthState(dispatch, me)
			connectSocket(token)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const loginWithFacebook = createAsyncThunk(
	'auth/loginWithFacebook',
	async ({ oauthData }, { dispatch, rejectWithValue }) => {
		try {
			const response = await api.post('/auth/facebook', oauthData)
			const { me, token } = response.data

			setCookie('token', token)
			applyAuthState(dispatch, me)
			connectSocket(token)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const registerUserWithEmail = createAsyncThunk(
	'auth/registerUserWithEmail',
	async ({ formData }, { dispatch, rejectWithValue }) => {
		try {
			const response = await api.post('/auth/register', formData)
			const { me, token } = response.data

			setCookie('token', token)
			applyAuthState(dispatch, me)
			connectSocket(token)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const requestPasswordReset = createAsyncThunk(
	'auth/requestPasswordReset',
	async ({ formData }, { rejectWithValue }) => {
		try {
			const response = await api.post('/auth/forgot-password', formData)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)

export const verifyResetToken = createAsyncThunk(
	'auth/verifyResetToken',
	async ({ token }, { rejectWithValue }) => {
		try {
			const response = await api.get(`/auth/verify-reset-token?token=${token}`)
			return response.data
		} catch (err) {
			return rejectWithValue(err)
		}
	}
)
