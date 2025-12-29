import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { MOBILE_BREAK } from '@/constants'
import { useResponsiveResize } from '@/hooks'

const Slider = ({
	items,
	slidesPerView = 1,
	spaceBetween = 30,
	heightItem = '500px',
	heightItemMobile = '300px',
}) => {
	const [height, setHeight] = useState(
		window.innerWidth < MOBILE_BREAK ? heightItemMobile : heightItem
	)

	useResponsiveResize({
		onMobileResize: () => setHeight(heightItemMobile),
		onDesktopResize: () => setHeight(heightItem),
	})

	return (
		<Swiper
			modules={[Navigation, Pagination, Autoplay]}
			slidesPerView={slidesPerView}
			spaceBetween={spaceBetween}
			loop={true}
			autoplay={{
				delay: 3000,
				disableOnInteraction: false,
			}}
			speed={800}
		>
			{Array.isArray(items) &&
				items.map((item, index) => (
					<SwiperSlide key={index}>
						<div className="flex justify-center items-center text-center">
							<img
								src={item.image}
								alt={item.title || `item-${index}`}
								className="w-full object-cover"
								style={{ height }}
							/>
							{item.title && <h3>{item.title}</h3>}
						</div>
					</SwiperSlide>
				))}
		</Swiper>
	)
}

export default Slider
