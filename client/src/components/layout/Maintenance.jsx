import { Spinner } from '@/components'

const Maintenance = (props) => {
	return (
		<div className="loader-container loader" {...props}>
			<div className="h-screen flex flex-col items-center justify-center gap-3">
				<span className="text-2xl">
					🚧 Trang web đang được bảo trì.
				</span>
			</div>
		</div>
	)
}

export default Maintenance
