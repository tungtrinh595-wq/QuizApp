import { RESULT_STATUS } from "@/constants"

const AchievedIndicator = ({ isPass = false }) => {
	return (
		<span className={`text-xl font-medium ${isPass ? 'text-success-500' : 'text-warning-500'}`}>
			{isPass ? RESULT_STATUS.PASS.label : RESULT_STATUS.FAIL.label}
		</span>
	)
}

export default AchievedIndicator
