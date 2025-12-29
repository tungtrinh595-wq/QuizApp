import { useRef, useState } from 'react'

import { DEFAULT } from '@/constants'
import { CameraIcon } from '@/assets/icons'
import { getDynamicClasses, getHintClasses } from '@/utils'
import { Button, Spinner } from '@/components'

const ImageField = ({
	id,
	label = 'Ảnh đại diện',
	isRequire = false,
	initImage = DEFAULT.IMAGE,
	className,
	onChange,
	isLoading = false,
	instantUpdate = false,
	success = false,
	error = false,
	hint,
	shape = 'square',
}) => {
	const [fileImage, setFileImage] = useState()
	const fileInputRef = useRef()

	const imageClasses = getDynamicClasses(
		{
			baseClasses:
				'relative group w-20 h-20 overflow-hidden border border-gray-200 dark:border-gray-800',
			variantClasses: [
				{
					shape: {
						square: 'rounded-lg',
						round: 'rounded-full',
					},
				},
			],
		},
		{ shape, className }
	)

	const hintClasses = getHintClasses({ error, success })

	const handleImageClick = () => {
		fileInputRef.current?.click()
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (!file) return
		setFileImage(file)
		if (onChange) onChange(file)
	}

	return (
		<>
			{label && (
				<p className="block text-sm font-medium text-gray-700">
					{label} {isRequire && <span className="text-error-500">*</span>}
				</p>
			)}
			<div id={id} className={imageClasses}>
				{isLoading ? (
					<div className="w-full h-full flex justify-center items-center">
						<Spinner size="sm" />
					</div>
				) : (
					<img
						src={fileImage && !instantUpdate ? URL.createObjectURL(fileImage) : initImage}
						alt={id}
						className="w-full h-full object-cover"
					/>
				)}

				<Button
					variant="hoverFadeIn"
					color="dark"
					onClick={handleImageClick}
					startIcon={<CameraIcon className="fill-white" />}
				>
					<input
						id={`${id}-hidden`}
						type="file"
						accept="image/*"
						className="hidden"
						ref={fileInputRef}
						onChange={handleImageChange}
					/>
				</Button>
			</div>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default ImageField
