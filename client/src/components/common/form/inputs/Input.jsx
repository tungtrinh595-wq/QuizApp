import { EyeIcon, EyeCloseIcon } from '@/assets/icons'
import { getDynamicClasses, getHintClasses } from '@/utils'
import { Label } from '@/components'

const Input = ({
	type = 'text',
	id,
	name,
	label,
	isRequire = false,
	placeholder,
	value = '',
	onChange,
	onBlur,
	className,
	min,
	max,
	step,
	disabled = false,
	success = false,
	error = false,
	hint,
	isPasswordField = false,
	showPassword = false,
	setShowPassword,
	size = 'md',
}) => {
	const inputClasses = getDynamicClasses(
		{
			baseClasses:
				'w-full border appearance-none text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-white dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
			stateClasses: [
				{
					class:
						'text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
					condition: disabled,
				},
				{
					class:
						'border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800',
					condition: !disabled && error,
				},
				{
					class:
						'border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800',
					condition: !disabled && !error && success,
				},
				{
					class:
						'text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800',
					condition: !disabled && !error && !success,
				},
			],
			variantClasses: [
				{
					size: {
						sm: 'h-7 px-2 py-1 rounded-md',
						md: 'h-11 px-4 py-2.5 rounded-lg',
					},
				},
			],
		},
		{ size, className }
	)

	const hintClasses = getHintClasses({ error, success })

	const autoCompleteMap = {
		email: 'email',
		name: 'name',
		tel: 'tel',
		phone: 'tel',
		password: 'current-password',
		currentPassword: 'current-password',
		newPassword: 'new-password',
	}
	const autoComplete = autoCompleteMap[name] || 'off'

	return (
		<>
			{label && (
				<Label htmlFor={id}>
					{label} {isRequire && <span className="text-error-500">*</span>}
				</Label>
			)}

			<div className="relative">
				<input
					type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
					id={id}
					name={name}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					min={min}
					max={max}
					step={step}
					disabled={disabled}
					className={inputClasses}
					autoComplete={autoComplete}
				/>
				{isPasswordField && (
					<span
						onClick={() => setShowPassword(!showPassword)}
						className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
					>
						{showPassword ? (
							<EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
						) : (
							<EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
						)}
					</span>
				)}
			</div>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default Input
