import dayjs from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')

export const formatDate = (dateString, format = 'dddd, D MMMM YYYY, HH:mm') => {
	if (!dateString) return ''
	return dayjs(dateString).format(format)
}
export const formatTime = (ms) => {
	const totalSeconds = Math.floor(ms / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60

	const paddedMinutes = String(minutes).padStart(2, '0')
	const paddedSeconds = String(seconds).padStart(2, '0')

	return `${paddedMinutes}:${paddedSeconds}`
}

export const normalizeDateRange = (range) => {
	if (!range?.startDate || !range?.endDate) return null
	return {
		startDate: range.startDate.toISOString(),
		endDate: range.endDate.toISOString(),
	}
}
