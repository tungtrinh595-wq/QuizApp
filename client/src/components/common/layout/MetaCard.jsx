const MetaCard = ({ image, title, badge, description, children, editButton }) => {
	return (
		<div className="p-5 bg-white border dark:bg-white/[0.03] border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-5">
				{editButton && <div className="flex justify-end">{editButton}</div>}
				<div className="flex flex-col items-center w-full gap-6 lg:flex-row lg:items-center lg:justify-between">
					{image && (
						<div className="relative flex items-center w-fit max-w-[50%] h-[200px] overflow-hidden border border-gray-200 rounded-lg dark:border-gray-800">
							<img
								src={image}
								alt="image"
								width={200}
								height={200}
								className="max-h-full w-full h-full object-cover"
							/>
						</div>
					)}

					<div className="flex-1 order-3 xl:order-2 text-center lg:text-left gap-2">
						{title && (
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
						)}
						{badge && <div>{badge}</div>}
						{description && (
							<p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
						)}
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MetaCard
