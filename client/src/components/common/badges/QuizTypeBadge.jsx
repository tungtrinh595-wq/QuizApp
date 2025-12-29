import { QUIZ_TYPE } from '@/constants'
import { getEnumLabel } from '@/utils'
import { Badge } from '@/components'

const QuizTypeBadge = ({ type }) => {
	let color = 'info'
	if (type === QUIZ_TYPE.EXAM.value) color = 'primary'
	if (type === QUIZ_TYPE.PRACTICE.value) color = 'light'
	return (
		<Badge size="sm" color={color}>
			<span className="whitespace-nowrap">{getEnumLabel(QUIZ_TYPE, type)}</span>
		</Badge>
	)
}

export default QuizTypeBadge
