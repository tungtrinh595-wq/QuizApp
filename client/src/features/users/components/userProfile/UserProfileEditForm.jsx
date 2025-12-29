import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { editProfileSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { editProfile, editUser } from '@/features'
import { Input, Button, TextArea } from '@/components'

const UserProfileEditForm = ({ userId, closeModal }) => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)
	const users = useSelector((state) => state.users)
	const profile = users.profiles?.[userId]

	const handleSubmit = ({ email, ...values }) => {
		if (profile?.id === auth.me?.id) {
			dispatch(editProfile({ formData: values }))
				.unwrap()
				.then(() => {
					handleSuccess(SUCCESS_MESSAGES.PROFILE_UPDATED)
					if (closeModal) closeModal()
				})
				.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
		} else {
			dispatch(editUser({ id: profile.id, formData: values }))
				.unwrap()
				.then(() => {
					handleSuccess(SUCCESS_MESSAGES.PROFILE_UPDATED)
					if (closeModal) closeModal()
				})
				.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
		}
	}

	return (
		<Formik
			initialValues={{
				name: profile?.name,
				email: profile?.email,
				bio: profile?.bio,
			}}
			validationSchema={editProfileSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
								<div>
									<Input
										id="user-profile-edit-name"
										name="name"
										label="Tên hiển thị"
										isRequire={true}
										placeholder="Nhập tên hiển thị"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.name}
										error={touched.name && errors.name}
										hint={touched.name && errors.name ? errors.name : ''}
									/>
								</div>
								<div>
									<Input
										id="user-profile-edit-email"
										name="email"
										label="Địa chỉ Email"
										isRequire={true}
										value={values.email}
										disabled={!!values.email}
									/>
								</div>
								<div className="col-span-1 lg:col-span-2">
									<TextArea
										id="user-profile-edit-bio"
										name="bio"
										label="Giới thiệu bản thân"
										placeholder="Cập nhật mô tả của bạn"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.bio}
										error={touched.bio && errors.bio}
										hint={touched.bio && errors.bio ? errors.bio : ''}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeModal}>
							Đóng
						</Button>
						<Button size="md" disabled={users.isLoading} type="submit">
							Lưu
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default UserProfileEditForm
