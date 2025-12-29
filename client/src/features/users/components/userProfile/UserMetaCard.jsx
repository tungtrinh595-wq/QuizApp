import { useDispatch, useSelector } from 'react-redux'

import { ROLE, PREFIX, PROVIDER, SUCCESS_MESSAGES } from '@/constants'
import { LockIcon, PencilIcon } from '@/assets/icons'
import { handleError, handleSuccess } from '@/utils'
import { useModal } from '@/hooks'
import {
	editUser,
	editProfile,
	UserProfileEditForm,
	UserProfileSetPasswordForm,
	UserProfileChangePasswordForm,
} from '@/features'
import { Modal, Button, UserRoleBadge, ImageField } from '@/components'

const UserMetaCard = ({ userId }) => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)
	const users = useSelector((state) => state.users)

	const { isOpen, openModal, closeModal } = useModal()
	const {
		isOpen: isOpenChangePass,
		openModal: openChangePassModal,
		closeModal: closeChangePassModal,
	} = useModal()
	const {
		isOpen: isOpenSetPass,
		openModal: openSetPassModal,
		closeModal: closeSetPassModal,
	} = useModal()

	const profile = userId ? users.profiles?.[userId] : users.profiles?.[auth.me?.id]
	const isOwner = profile?.id === auth.me?.id
	const isAdmin = auth.me?.role === ROLE.ADMIN.value

	const handleImageChange = (file) => {
		if (!file) return

		const formData = new FormData()
		formData.append('image', file)
		if (profile?.id === auth.me?.id) {
			dispatch(editProfile({ formData }))
				.unwrap()
				.then(() => handleSuccess(SUCCESS_MESSAGES.AVATAR_UPDATED))
				.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
		} else {
			dispatch(editUser({ id: profile.id, formData }))
				.unwrap()
				.then(() => handleSuccess(SUCCESS_MESSAGES.AVATAR_UPDATED))
				.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
		}
	}

	return (
		<>
			<div className="p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] rounded-2xl lg:p-6">
				<div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex flex-col items-center w-full gap-6 xl:flex-row">
						<ImageField
							id="profile-edit-image"
							label=""
							initImage={profile?.avatar?.url}
							onChange={(file) => handleImageChange(file)}
							isLoading={users.isLoading}
							instantUpdate={true}
							shape="round"
						/>

						<div className="flex-1 order-3 xl:order-2">
							<h3 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
								{profile?.name}
							</h3>
							<div className="flex flex-col items-left gap-2 text-center xl:text-left">
								<p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
								<div>
									<UserRoleBadge role={profile?.role} />
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">{profile?.bio}</p>
							</div>
						</div>
					</div>
					{(isOwner || isAdmin) && (
						<div className="flex flex-1 flex-wrap w-full items-center justify-center gap-2 xl:flex-row">
							<Button size="sm" variant="roundGroup" color="neutral" onClick={openModal}>
								<PencilIcon />
								Chỉnh sửa
							</Button>
							{profile?.provider === PROVIDER.EMAIL.value ? (
								<Button
									size="sm"
									variant="roundGroup"
									color="neutral"
									onClick={openChangePassModal}
								>
									<LockIcon />
									<span className="flex-1 whitespace-nowrap">Thay đổi mật khẩu</span>
								</Button>
							) : (
								<Button size="sm" variant="roundGroup" color="neutral" onClick={openSetPassModal}>
									<LockIcon />
									<span className="flex-1 whitespace-nowrap">Đặt mật khẩu</span>
								</Button>
							)}
						</div>
					)}
				</div>
			</div>

			{(isOwner || isAdmin) && (
				<>
					<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
						<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
							<div className="px-2 pr-14">
								<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
									Chỉnh sửa thông tin cá nhân
								</h4>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Cập nhật thông tin chi tiết để giữ cho hồ sơ của bạn được cập nhật.
								</p>
							</div>
							<UserProfileEditForm userId={userId} closeModal={closeModal} />
						</div>
					</Modal>

					<Modal
						isOpen={isOpenChangePass}
						onClose={closeChangePassModal}
						className="max-w-[700px] m-4"
					>
						<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
							<div className="px-2 pr-14">
								<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
									Thay đổi mật khẩu
								</h4>
								<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
									Bảo mật tài khoản của bạn bằng cách cập nhật mật khẩu thường xuyên.
								</p>
							</div>
							<UserProfileChangePasswordForm userId={userId} closeModal={closeChangePassModal} />
						</div>
					</Modal>

					<Modal isOpen={isOpenSetPass} onClose={closeSetPassModal} className="max-w-[700px] m-4">
						<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
							<div className="px-2 pr-14">
								<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
									Đặt mật khẩu
								</h4>
								<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
									Bảo mật tài khoản của bạn bằng cách cập nhật mật khẩu thường xuyên.
								</p>
							</div>
							<UserProfileSetPasswordForm userId={userId} closeModal={closeSetPassModal} />
						</div>
					</Modal>
				</>
			)}
		</>
	)
}

export default UserMetaCard
