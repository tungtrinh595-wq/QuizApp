import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { QUERY_DEFAULT } from '@/constants'
import { extractError } from '@/utils'
import {
	getUsers,
	getProfile,
	addUser,
	editUser,
	deleteUser,
	setUserPassword,
	editProfile,
	changePassword,
	setPassword,
} from './usersThunks'

const initialState = {
	list: null,
	profiles: {
		// [userId]: UserProfile
	},
	query: QUERY_DEFAULT,
	total: 0,
	totalPages: 0,
	prevQuery: {},
	isLoading: false,
	error: null,
}

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUsersQuery(state, action) {
			state.query = action.payload
		},
		setUsersPrevQuery(state, action) {
			state.prevQuery = action.payload
		},
		cacheUserProfile(state, action) {
			const user = action.payload?.profile || action.payload?.user
			if (user?.id) state.profiles[user.id] = user
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUsers.fulfilled, (state, action) => {
				state.isLoading = false

				const { profiles, users, page, limit, total, totalPages } = action.payload
				if (profiles) state.profiles = profiles
				if (Array.isArray(users)) state.list = users
				if (typeof total === 'number') state.total = total
				if (typeof page === 'number') state.query.page = page
				if (typeof limit === 'number') state.query.limit = limit
				if (typeof totalPages === 'number') state.totalPages = totalPages
			})
			.addCase(deleteUser.fulfilled, (state) => {
				state.isLoading = false
			})
			.addMatcher(
				isAnyOf(
					getUsers.pending,
					getProfile.pending,
					addUser.pending,
					editUser.pending,
					deleteUser.pending,
					setUserPassword.pending,
					editProfile.pending,
					changePassword.pending,
					setPassword.pending
				),
				(state) => {
					state.isLoading = true
					state.error = null
				}
			)
			.addMatcher(
				isAnyOf(
					getProfile.fulfilled,
					addUser.fulfilled,
					editUser.fulfilled,
					setUserPassword.fulfilled,
					editProfile.fulfilled,
					changePassword.fulfilled,
					setPassword.fulfilled
				),
				(state, action) => {
					state.isLoading = false

					const { user } = action.payload
					if (user?.id) {
						state.profiles[user.id] = user

						if (Array.isArray(state.list)) {
							const updatedUsers = state.list.map((u) => (u.id === user.id ? { ...u, ...user } : u))
							state.list = updatedUsers
						}
					}
				}
			)
			.addMatcher(
				isAnyOf(
					getUsers.rejected,
					getProfile.rejected,
					addUser.rejected,
					editUser.rejected,
					deleteUser.rejected,
					setUserPassword.rejected,
					editProfile.rejected,
					changePassword.rejected,
					setPassword.rejected
				),
				(state, action) => {
					state.isLoading = false
					state.error = extractError(action)
				}
			)
	},
})

export const { setUsersQuery, setUsersPrevQuery, cacheUserProfile } = usersSlice.actions
export default usersSlice.reducer
