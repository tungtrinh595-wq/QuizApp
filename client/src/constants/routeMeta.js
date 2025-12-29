export const ROUTES = {
	HOME: '/',
	USERS: '/users',
	PROFILE: '/profile',
	SUBJECTS: '/subjects',
	SUBJECT_DETAILS: '/subject/:slug',
	LESSONS: '/lessons',
	LESSON_DETAILS: '/lesson/:slug',
	QUIZZES: '/quizzes',
	QUIZ_DETAILS: '/quiz/:slug',
	ADMIN_DASHBOARD: '/admin',
	ADMIN: {
		PROFILE: '/admin/profile',
		USERS: '/admin/users',
		USER_DETAILS: '/admin/user/:slug',
		SUBJECTS: '/admin/subjects',
		SUBJECT_DETAILS: '/admin/subject/:id',
		LESSONS: '/admin/lessons',
		LESSON_DETAILS: '/admin/lesson/:id',
		SUBJECT_LESSON_DETAILS: '/admin/subject/:subjectId/lesson/:id',
		QUIZZES: '/admin/quizzes',
		QUIZ_DETAILS: '/admin/quiz/:id',
		SUBJECT_QUIZ_DETAILS: '/admin/subject/:subjectId/quiz/:id',
		ERROR404: '/admin/error-404',
		REST: '/admin/*',
	},
	BLANK: '/blank',
	ERROR404: '/error-404',
	SIGNIN: '/signin',
	SIGNUP: '/signup',
	FORGOT_PASSWORD: '/forgot-password',
	RESET_PASSWORD: '/reset-password',
	REST: '/*',
}

export const PAGE_TITLES = {
	HOME: 'Trang Chủ',
	USER: 'Người dùng',
	SUBJECTS: 'Môn học',
	SUBJECT_DETAILS: 'Chi tiết môn học',
	LESSONS: 'Bài học',
	LESSON_DETAILS: 'Chi tiết bài học',
	QUIZZES: 'Bài thi',
	QUIZ_DETAILS: 'Chi tiết bài thi',
	PROFILE: 'Hồ sơ',
	USER_PROFILE: 'Hồ sơ người dùng',
	PAGES: 'Danh sách trang',
	PAGE: {
		BLANK: 'Blank Page',
		ERROR404: '404 Error',
	},
	ADMIN: {
		DASHBOARD: 'Trang quản lý',
		TABLES: 'Danh sách quản lý',
		USERS: 'Quản lý người dùng',
		SUBJECTS: 'Quản lý môn học',
		LESSONS: 'Quản lý bài học',
		QUIZZES: 'Quản lý kỳ thi',
	},
}

export const BREADCRUMB = {
	HOME: {
		link: ROUTES.HOME,
		title: PAGE_TITLES.HOME,
	},
	ADMIN: {
		link: ROUTES.ADMIN_DASHBOARD,
		title: PAGE_TITLES.ADMIN.DASHBOARD,
	},
	ADMIN_USERS: {
		link: ROUTES.ADMIN.USERS,
		title: PAGE_TITLES.ADMIN.USERS,
	},
	ADMIN_SUBJECTS: {
		link: ROUTES.ADMIN.SUBJECTS,
		title: PAGE_TITLES.ADMIN.SUBJECTS,
	},
	ADMIN_LESSONS: {
		link: ROUTES.ADMIN.LESSONS,
		title: PAGE_TITLES.ADMIN.LESSONS,
	},
	ADMIN_QUIZZES: {
		link: ROUTES.ADMIN.QUIZZES,
		title: PAGE_TITLES.ADMIN.QUIZZES,
	},
}
