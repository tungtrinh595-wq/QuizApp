import { ROLE, QUIZ_TYPE } from '@/constants'

export const getEnumLabel = (enumObj, value) => {
	const entry = Object.values(enumObj).find((item) => item.value === value)
	return entry?.label || ''
}

export const getQuizTypeLabel = (type) => {
	if (type === QUIZ_TYPE.EXAM.value) return 'Bài thi'
	if (type === QUIZ_TYPE.PRACTICE.value) return 'Bài thi thử'
	if (type === QUIZ_TYPE.SURVEY.value) return 'Khảo sát'
	return ''
}

export const switchRole = (role) => {
	if (role === ROLE.ADMIN.value) return ROLE.USER.value
	if (role === ROLE.USER.value) return ROLE.ADMIN.value
	return ''
}

export const getThemeSwitch = (theme) => {
	if (theme == 'light') return 'Tối'
	if (theme == 'dark') return 'Sáng'
	return ''
}
