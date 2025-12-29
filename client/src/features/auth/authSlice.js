import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { extractError, getToken } from '@/utils'
import {
	loadMe,
	loginWithOauth,
	loginWithEmail,
	loginWithFacebook,
	loginWithGoogle,
	registerUserWithEmail,
	requestPasswordReset,
	verifyResetToken,
} from './authThunks'

const loginThunks = [loginWithEmail, loginWithGoogle, loginWithFacebook, loginWithOauth]
const registerThunks = [registerUserWithEmail]
const resetThunks = [requestPasswordReset, verifyResetToken]

const initialState = {
	token: getToken(),
	me: null,
	isAuthenticated: false,
	isLoading: true,
	isPageLoading: true,
	isLogout: false,
	error: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		guestAccess(state) {
			state.isLoading = false
			state.isPageLoading = false
			state.error = null
		},
		setAuthUser(state, action) {
			const { me } = action.payload
			state.me = me
			state.isLoading = false
			state.isPageLoading = false
			state.isLogout = false
		},
		clearAuth(state) {
			state.token = null
			state.me = null
			state.isAuthenticated = false
			state.isLoading = false
			state.error = null
		},
		logout(state) {
			state.token = null
			state.me = null
			state.isAuthenticated = false
			state.isLoading = false
			state.error = null
			state.isLogout = true
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				isAnyOf(
					...loginThunks.map((t) => t.pending),
					...registerThunks.map((t) => t.pending),
					...resetThunks.map((t) => t.pending),
					loadMe.pending
				),
				(state) => {
					state.isLoading = true
					state.error = null
				}
			)
			.addMatcher(
				isAnyOf(...loginThunks.map((t) => t.fulfilled), loadMe.fulfilled, loginWithOauth.fulfilled),
				(state, action) => {
					const { me, token } = action.payload
					if (token) state.token = token
					state.me = me
					state.isAuthenticated = true
					state.isLoading = false
					state.isPageLoading = false
					state.error = null
					state.isLogout = false
				}
			)
			.addMatcher(isAnyOf(...resetThunks.map((t) => t.fulfilled)), (state) => {
				state.isLoading = false
			})
			.addMatcher(
				isAnyOf(...loginThunks.map((t) => t.rejected), loadMe.rejected),
				(state, action) => {
					state.token = null
					state.me = null
					state.isAuthenticated = false
					state.isLoading = false
					state.isPageLoading = false
					state.error = extractError(action)
				}
			)
			.addMatcher(
				isAnyOf(...registerThunks.map((t) => t.rejected), ...resetThunks.map((t) => t.rejected)),
				(state, action) => {
					state.isLoading = false
					state.error = extractError(action)
				}
			)
	},
})

export const { guestAccess, setAuthUser, clearAuth, logout } = authSlice.actions
export default authSlice.reducer
