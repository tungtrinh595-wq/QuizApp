import { useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { DEFAULT, MOBILE_BREAK } from '@/constants'
import { useResponsiveResize } from '@/hooks'
import { Spinner } from '@/components'

const Banner = ({
	image = DEFAULT.IMAGE,
	title,
	description,
	heightItem = '500px',
	heightItemMobile = '300px',
	isLoading = false,
}) => {
	const [height, setHeight] = useState(
		window.innerWidth < MOBILE_BREAK ? heightItemMobile : heightItem
	)

	useResponsiveResize({
		onMobileResize: () => setHeight(heightItemMobile),
		onDesktopResize: () => setHeight(heightItem),
	})

	return (
		<div
			className="bg-cover bg-center"
			style={{
				backgroundImage: `url(${image})`,
				height: height,
			}}
		>
			<div className="w-full h-full mx-auto flex flex-col gap-6 justify-center items-center text-center bg-black/50">
				{isLoading ? (
					<Spinner />
				) : (
					<>
						{title && <h1 className="text-3xl text-white [text-shadow:_0_0_8px_white]">{title}</h1>}
						{description && <p className="max-w-[700px] text-white">{description}</p>}
					</>
				)}
			</div>
		</div>
	)
}

export default Banner
