import { PAGE_SIZE_OPTIONS } from '@/constants'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleChevronLeftIcon,
	DoubleChevronRightIcon,
} from '@/assets/icons'
import { Input, Select, Button } from '@/components'

const PaginationControls = ({ page, totalPages, limit, simplePaging, setLocalSearch }) => {
	if (limit === -1 || totalPages <= 1) return null

	return (
		<div className="px-5 py-3 flex items-center justify-center gap-3">
			{!simplePaging && (
				<Button
					color="lightGray"
					size="custom"
					className="hidden md:flex items-center justify-center w-[40px] h-[40px] p-1 bg-gray-300 text-blue-950 hover:bg-gray-400"
					disabled={page === 1}
					onClick={() => setLocalSearch('page', 1)}
				>
					<DoubleChevronLeftIcon />
				</Button>
			)}
			<Button
				color="lightGray"
				size="custom"
				className="flex items-center justify-center w-[40px] h-[40px] p-0"
				disabled={page === 1}
				onClick={() => setLocalSearch('page', page - 1)}
			>
				<ChevronLeftIcon />
			</Button>
			<p>
				Trang <b>{page}</b> / <b>{totalPages}</b>
			</p>
			{!simplePaging && (
				<>
					<div className="hidden md:flex items-center justify-center gap-3 mx-4">
						<p>Đến trang:</p>
						<Input
							name="page"
							type="number"
							min={1}
							max={totalPages}
							value={page}
							className="max-w-[70px]"
							onChange={(e) => setLocalSearch('page', parseInt(e.target.value))}
						/>
					</div>
					<p className="hidden md:flex items-center justify-center ">Hiển thị</p>
					<Select
						name="page-size-selector"
						placeholder="Chọn số lượng hiển thị"
						value={limit}
						onChange={(value) => setLocalSearch('limit', value)}
						options={PAGE_SIZE_OPTIONS}
						className="max-w-[90px] hidden md:flex items-center justify-center "
					/>
				</>
			)}
			<Button
				color="lightGray"
				size="custom"
				className="flex items-center justify-center w-[40px] h-[40px] p-0"
				disabled={page === totalPages}
				onClick={() => setLocalSearch('page', page + 1)}
			>
				<ChevronRightIcon />
			</Button>
			{!simplePaging && (
				<Button
					color="lightGray"
					size="custom"
					className="w-[40px] h-[40px] p-1 hidden md:flex items-center justify-center "
					disabled={page === totalPages}
					onClick={() => setLocalSearch('page', totalPages)}
				>
					<DoubleChevronRightIcon />
				</Button>
			)}
		</div>
	)
}

export default PaginationControls
