import { twMerge } from 'tailwind-merge'

const resolveNestedVariant = (variants, keys) => {
	const key = keys.shift()
	if (typeof variants[key] === 'object') {
		return resolveNestedVariant(variants[key], keys)
	}
	return variants[key] || ''
}

export const getDynamicClasses = (
	{ baseClasses = '', stateClasses = [], variantClasses = [] } = {},
	{ className = '', ...restParams } = {}
) => {
	const resolvedStateClasses = stateClasses
		.filter((item) => item.condition)
		.map((item) => item.class)

	const resolvedVariantClasses = variantClasses.flatMap((variantGroup) => {
		return Object.entries(variantGroup).flatMap(([variantType, variants]) => {
			const selected = restParams[variantType]

			if (Array.isArray(selected) && selected.length > 1) {
				return resolveNestedVariant(variants, selected)
			}

			return variants[selected] || ''
		})
	})

	return twMerge(baseClasses, ...resolvedStateClasses, ...resolvedVariantClasses, className)
}

export const getHintClasses = ({ error = false, success = false } = {}) => {
	return getDynamicClasses({
		baseClasses: 'mt-1.5 text-xs',
		stateClasses: [
			{ class: 'text-error-500', condition: error },
			{ class: 'text-success-500', condition: !error && success },
			{ class: 'text-gray-500', condition: !error && !success },
		],
	})
}
