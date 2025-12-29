import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PAGE_TITLES, PREFIX, ROLE, ROUTES } from '@/constants'
import { handleError } from '@/utils'
import { getProfile, UserMetaCard, UserResults } from '@/features'
import { PageMeta, PageBreadcrumb, BackButton } from '@/components'

const UserProfiles = ({ mode }) => {
	const navigate = useNavigate()
	const { slug } = useParams()
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)
	const users = useSelector((state) => state.users)
	const userId = slug
		? Object.values(users.profiles || {}).find((u) => u.slug === slug)?.id
		: auth.me?.id
	const profile = users.profiles?.[userId]

	useEffect(() => {
		if (slug && !profile)
			dispatch(getProfile({ slug }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED, navigate))
	}, [slug, profile])

	return (
		<>
			<PageMeta
				title="Hồ sơ người dùng | Quiz App"
				description="Quản lý thông tin cá nhân, bài kiểm tra đã làm và cài đặt tài khoản của bạn trong giao diện hồ sơ của ứng dụng Quiz."
			/>
			<div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pb-6 space-y-6">
				<BackButton className="mt-6" />
				{profile && (
					<>
						<PageBreadcrumb
							breadcrumbs={[
								{
									link: mode === ROLE.ADMIN.value ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME,
									title: mode === ROLE.ADMIN.value ? PAGE_TITLES.ADMIN.DASHBOARD : PAGE_TITLES.HOME,
								},
								...(slug && mode === ROLE.ADMIN.value
									? [
											{
												link: ROUTES.ADMIN.USERS,
												title: PAGE_TITLES.ADMIN.USERS,
											},
									  ]
									: []),
							]}
							pageTitle={profile.name}
						/>
						<UserMetaCard userId={profile.id} />
						<UserResults userId={profile.id} />
					</>
				)}
			</div>
		</>
	)
}

export default UserProfiles
