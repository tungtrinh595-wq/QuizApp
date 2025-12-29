import { Spinner } from '@/components'

const Loader = (props) => {
	return (
		<div className="loader-container loader" {...props}>
			<div className="h-screen flex flex-col items-center justify-center gap-3">
				<Spinner size="lg" />
				<span className="text-2xl">Đang tải dữ liệu...</span>
			</div>
		</div>
	)
}

export default Loader
