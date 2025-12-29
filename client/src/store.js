import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/features/auth/authSlice'
import usersReducer from '@/features/users/usersSlice'
import quizzesReducer from '@/features/quizzes/quizzesSlice'
import resultsReducer from '@/features/results/resultsSlice'
import lessonsReducer from '@/features/lessons/lessonsSlice'
import messagesReducer from '@/features/messages/messagesSlice'
import subjectsReducer from '@/features/subjects/subjectsSlice'

const store = configureStore({
	reducer: {
		auth: authReducer,
		users: usersReducer,
		quizzes: quizzesReducer,
		results: resultsReducer,
		lessons: lessonsReducer,
		messages: messagesReducer,
		subjects: subjectsReducer,
	},
	devTools: import.meta.env.VITE_NODE_ENV !== 'production',
})

export default store
