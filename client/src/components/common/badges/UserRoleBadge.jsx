import { ROLE } from '@/constants'
import { getEnumLabel } from '@/utils'
import { Badge } from '@/components'

const UserRoleBadge = ({ role }) => {
	let color = 'info'
	if (role === ROLE.ADMIN.value) color = 'primary'

	return (
		<Badge size="sm" color={role === ROLE.ADMIN.value ? 'primary' : 'info'}>
			<span className="whitespace-nowrap">{getEnumLabel(ROLE, role)}</span>
		</Badge>
	)
}

export default UserRoleBadge
