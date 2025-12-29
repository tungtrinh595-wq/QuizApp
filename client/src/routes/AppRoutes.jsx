import { Routes, Route } from 'react-router-dom'

import { ROLE, ROUTES } from '@/constants'
import { PublicRoute, PrivateRoute } from '@/routes'
import { Layout, AdminLayout, AuthLayout } from '@/layouts'
import {
	Home,
	UserProfiles,
	UserSubjectDetails,
	UserLessonDetails,
	UserQuizDetails,
	AdminDashboard,
	AdminUsers,
	AdminSubjects,
	AdminSubjectDetails,
	AdminLessons,
	AdminLessonDetails,
	AdminQuizzes,
	AdminQuizDetails,
	SignIn,
	SignUp,
	ForgotPassword,
	ResetPassword,
	NotFound,
} from '@/pages'

const AppRoutes = () => (
	<Routes>
		<Route element={<PublicRoute />}>
			<Route element={<Layout />}>
				<Route path={ROUTES.HOME} element={<Home />} />
			</Route>
		</Route>

		<Route element={<PrivateRoute />}>
			<Route element={<Layout />}>
				<Route path={ROUTES.PROFILE} element={<UserProfiles mode={ROLE.USER} />} />
				<Route path={ROUTES.SUBJECT_DETAILS} element={<UserSubjectDetails />} />
				<Route path={ROUTES.LESSON_DETAILS} element={<UserLessonDetails />} />
				<Route path={ROUTES.QUIZ_DETAILS} element={<UserQuizDetails />} />
			</Route>
		</Route>

		<Route element={<PrivateRoute requiredRole={[ROLE.ADMIN.value]} />}>
			<Route element={<AdminLayout />}>
				<Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
				<Route path={ROUTES.ADMIN.USERS} element={<AdminUsers />} />
				<Route
					path={ROUTES.ADMIN.USER_DETAILS}
					element={<UserProfiles mode={ROLE.ADMIN.value} />}
				/>
				<Route path={ROUTES.ADMIN.SUBJECTS} element={<AdminSubjects />} />
				<Route path={ROUTES.ADMIN.SUBJECT_DETAILS} element={<AdminSubjectDetails />} />
				<Route path={ROUTES.ADMIN.SUBJECT_LESSON_DETAILS} element={<AdminLessonDetails />} />
				<Route path={ROUTES.ADMIN.SUBJECT_QUIZ_DETAILS} element={<AdminQuizDetails />} />
				<Route path={ROUTES.ADMIN.LESSONS} element={<AdminLessons />} />
				<Route path={ROUTES.ADMIN.LESSON_DETAILS} element={<AdminLessonDetails />} />
				<Route path={ROUTES.ADMIN.QUIZZES} element={<AdminQuizzes />} />
				<Route path={ROUTES.ADMIN.QUIZ_DETAILS} element={<AdminQuizDetails />} />
				<Route path={ROUTES.ADMIN.PROFILE} element={<UserProfiles mode={ROLE.ADMIN.value} />} />
				<Route path={ROUTES.ADMIN.REST} element={<NotFound mode={ROLE.ADMIN.value} />} />
			</Route>
		</Route>

		<Route element={<AuthLayout />}>
			<Route path={ROUTES.SIGNIN} element={<SignIn />} />
			<Route path={ROUTES.SIGNUP} element={<SignUp />} />
			<Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
			<Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
		</Route>

		<Route element={<Layout />}>
			<Route path={ROUTES.REST} element={<NotFound />} />
		</Route>
	</Routes>
)

export default AppRoutes
