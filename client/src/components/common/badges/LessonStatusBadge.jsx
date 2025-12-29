import { LESSON_STATUS } from '@/constants'
import { getEnumLabel } from '@/utils'
import { Badge } from '@/components'

const LessonStatusBadge = ({ status }) => {
	let color = 'info'
	if (status === LESSON_STATUS.PUBLISHED.value) color = 'primary'
	return (
		<Badge size="sm" color={color}>
			<span className="whitespace-nowrap">{getEnumLabel(LESSON_STATUS, status)}</span>
		</Badge>
	)
}

export default LessonStatusBadge
