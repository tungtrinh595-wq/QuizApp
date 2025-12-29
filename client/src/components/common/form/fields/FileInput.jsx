import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

import { getHintClasses } from '@/utils'

const FileInput = forwardRef(
	({ name, accept, className, onChange, success = false, error = false, hint }, ref) => {
		const inputClasses = twMerge(
			// Base layout
			'h-11 w-full overflow-hidden rounded-lg text-sm transition-colors shadow-theme-xs cursor-pointer',
			// Border & background
			'border border-gray-300 bg-transparent text-gray-500',
			// Focus & placeholder
			'focus:outline-hidden focus:border-ring-brand-300 placeholder:text-gray-400',
			// File input styles
			'file:mr-5 file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 hover:file:bg-gray-100 focus:file:ring-brand-300',
			// Dark mode
			'dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-400',
			'dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400',
			className
		)
		const hintClasses = getHintClasses({ error, success })

		return (
			<>
				<input
					ref={ref}
					name={name}
					type="file"
					{...(accept ? { accept } : {})}
					className={inputClasses}
					onChange={onChange}
				/>
				{hint && <p className={hintClasses}>{hint}</p>}
			</>
		)
	}
)

export default FileInput
