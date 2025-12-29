import { Fragment, useEffect, useState } from 'react'

import { DownloadIcon, GoogleDriveIcon, TrashBinIcon } from '@/assets/icons'
import { Button, Spinner, Tooltip } from '@/components'
import { UPLOADER } from '@/constants'

const LessonFileGrid = ({ files, onRemove, showDownload = false }) => {
	const [removingItems, setRemovingItems] = useState([])

	const handleRemove = (id) => {
		const newRemoveItems = [...removingItems, id]
		setRemovingItems(newRemoveItems)
		onRemove(id)
	}

	useEffect(() => {
		if (!files || files.length === 0) {
			setRemovingItems([])
			return
		}

		const currentIds = files.map(({ id }) => id)
		setRemovingItems((prev) => prev.filter((id) => currentIds.includes(id)))
	}, [files])

	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(0,100px))] gap-x-6 gap-y-5">
			{files.map(({ id, file }, index) => (
				<Fragment key={`${file?.name}-${index}`}>
					<Tooltip content={file?.filename} className="w-full h-full" tooltipMaxWidth="200px">
						<div className="relative w-full h-full group auto">
							<img
								src={file?.reviewUrl}
								alt={file?.filename}
								className="w-full h-full object-contain rounded"
							/>
							{removingItems.includes(id) ? (
								<div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center gap-2">
									<Spinner size="sm" />
								</div>
							) : (
								<div className="absolute flex flex-wrap gap-2 top-0 bottom-0 left-0 right-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
									{showDownload && (
										<a
											href={file?.url}
											target="_blank"
											download={file?.filename}
											className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 shadow-theme-xs rounded-full whitespace-nowrap group border border-brand-300 bg-white text-brand-700 hover:bg-brand-50 hover:text-brand-800"
										>
											{file?.uploader === UPLOADER.GOOGLE_DRIVE ? (
												<GoogleDriveIcon width={20} height={20} />
											) : (
												<DownloadIcon
													width={20}
													height={20}
													className="fill-brand-600 group-hover:fill-brand-800"
												/>
											)}
										</a>
									)}
									{onRemove && (
										<Button
											block="absolute"
											position="center"
											size="sm"
											variant="roundGroup"
											color="warning"
											onClick={() => handleRemove(id)}
										>
											<TrashBinIcon
												width={20}
												height={20}
												className="fill-warning-700 group-hover:fill-warning-800"
											/>
										</Button>
									)}
								</div>
							)}
						</div>
					</Tooltip>
				</Fragment>
			))}
		</div>
	)
}

export default LessonFileGrid
