import {
	PageMeta,
	Metrics,
	MonthlyChart,
	MonthlyTarget,
	StatisticsChart,
} from '@/components'

const AdminDashboard = () => {
	return (
		<>
			<PageMeta
				title="Quản lý chung | Quiz App"
				description="Quản lý người dùng, theo dõi hoạt động kiểm tra và kiểm soát cài đặt hệ thống từ Bảng điều khiển quản trị của Quiz App — được xây dựng bằng React và Tailwind CSS."
			/>
			<div className="grid grid-cols-12 gap-4 md:gap-6">
				<div className="col-span-12 space-y-6 xl:col-span-7">
					<Metrics />
					<MonthlyChart />
				</div>

				<div className="col-span-12 xl:col-span-5">
					<MonthlyTarget />
				</div>

				<div className="col-span-12">
					<StatisticsChart />
				</div>
			</div>
		</>
	)
}

export default AdminDashboard
