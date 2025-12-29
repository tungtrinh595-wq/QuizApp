import React from 'react'

import { SubjectListCard } from '@/features'
import { PageMeta, Slider } from '@/components'

const Home = () => {
	return (
		<>
			<PageMeta
				title="Trang chủ | Ứng dụng Quiz"
				description="Khám phá các môn học, bài học và bài kiểm tra để ôn tập và đánh giá kiến thức của bạn. Học tập dễ dàng, thi cử hiệu quả — tất cả trong một nền tảng duy nhất."
			/>
			<div className="home-page">
				<Slider
					items={[
						{ image: '/images/carousel/carousel-01.png' },
						{ image: '/images/carousel/carousel-02.png' },
						{ image: '/images/carousel/carousel-03.png' },
						{ image: '/images/carousel/carousel-04.png' },
					]}
				/>
				<div className="max-w-screen-2xl mx-auto p-4 md:p-6 flex flex-col gap-6">
					<SubjectListCard />
				</div>
			</div>
		</>
	)
}

export default Home
