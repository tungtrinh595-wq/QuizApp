import { ChevronLeftIcon } from '@/assets/icons'
import { useGoBack } from '@/hooks'
import { getDynamicClasses } from '@/utils'

const BackButton = ({ className, fixed = false }) => {
	const buttonClasses = getDynamicClasses(
		{
			baseClasses:
				'inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
			stateClasses: [{ class: 'fixed top-0 left-0 mt-2 ml-1', condition: fixed }],
		},
		{ className }
	)

	return (
		<button className={buttonClasses} onClick={useGoBack()}>
			<ChevronLeftIcon className="size-5" />
			Back
		</button>
	)
}

export default BackButton
