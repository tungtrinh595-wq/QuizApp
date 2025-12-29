import { useEffect, useState } from 'react'

const AnswerStatsProgressField = ({ questionText, type, total, answers, fillInAnswers }) => {
	return (
		<div className="mb-6">
			<h4 className="font-semibold text-lg text-gray-800 dark:text-white/90 mb-2">{questionText}</h4>

			{Object.keys(answers).length === 0 && Object.keys(fillInAnswers).length === 0 && (
				<p>Chưa ai chọn trả lời câu hỏi này</p>
			)}

			{type === 'multiple-choice' && (
				<div className="space-y-4">
					{Object.entries(answers).map(([id, { text, count }], index) => {
						const percent = Math.round((count / total) * 100)
						const [animatedPercent, setAnimatedPercent] = useState(0)

						useEffect(() => {
							const timeout = setTimeout(() => setAnimatedPercent(percent), index * 150)
							return () => clearTimeout(timeout)
						}, [percent, index])

						return (
							<div key={id}>
								<div className="relative w-full bg-gray-200 rounded overflow-hidden">
									<div
										className="absolute top-0 left-0 h-full bg-brand-200 transition-all duration-700 ease-out"
										style={{ width: `${animatedPercent}%` }}
									/>
									<div className="relative w-fill p-3 h-full flex items-center justify-between gap-3 text-sm mb-1">
										<span className="flex-1 text-gray-700">{text}</span>
										<span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
											{count} / {total} người chọn
										</span>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{type === 'fill-in' && (
				<ul className="space-y-2 mt-2 custom-scrollbar max-h-[450px] overflow-y-auto">
					{Object.entries(fillInAnswers)
						.sort((a, b) => {
							const countA = typeof a[1].count === 'number' ? a[1].count : -Infinity
							const countB = typeof b[1].count === 'number' ? b[1].count : -Infinity
							return countB - countA
						})
						.map(([index, { text, count }]) => {
							const percent = Math.round((count / total) * 100)
							const [animatedPercent, setAnimatedPercent] = useState(0)

							useEffect(() => {
								const timeout = setTimeout(() => setAnimatedPercent(percent), index * 150)
								return () => clearTimeout(timeout)
							}, [percent, index])

							return (
								<li key={index} className="bg-gray-50 rounded-md border text-sm text-gray-700">
									<div className="relative w-full bg-gray-200 rounded overflow-hidden">
										<div
											className="absolute top-0 left-0 h-full bg-brand-200 transition-all duration-700 ease-out"
											style={{ width: `${animatedPercent}%` }}
										/>
										<div className="relative w-fill p-3 h-full flex items-center justify-between gap-3 text-sm mb-1">
											<span className="flex-1 text-gray-700">
												{text || <span className="italic text-gray-400">[Trống]</span>}
											</span>
											{count > 1 && (
												<span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
													có {count} người đồng ý kiến
												</span>
											)}
										</div>
									</div>
								</li>
							)
						})}
				</ul>
			)}
		</div>
	)
}

export default AnswerStatsProgressField
