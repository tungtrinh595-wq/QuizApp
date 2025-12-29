import { GridIcon } from '@/assets/icons'
import { PAGE_TITLES, ROUTES, ROLE } from '@/constants'

export const userNavItems = [
	{
		name: PAGE_TITLES.ADMIN.DASHBOARD,
		icon: <GridIcon />,
		path: ROUTES.ADMIN_DASHBOARD,
		require: ROLE.ADMIN.value,
	},
]
