import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { updatePasswordSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { changePassword, changeUserPassword } from '@/features'
import { Input, Button } from '@/components'

const UserProfileChangePasswordForm = ({ userId, closeModal }) => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)
	const users = useSelector((state) => state.users)
	const profile = users.profiles?.[userId]
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)

	const handleSubmit = (values) => {
		if (profile?.id === auth.me?.id) {
			dispatch(changePassword({ formData: values }))
				.unwrap()
				.then(() => {
					handleSuccess(SUCCESS_MESSAGES.PASSWORD_UPDATED)
					if (closeModal) closeModal()
				})
				.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
		} else {
			dispatch(changeUserPassword({ id: profile?.id, formData: values }))
				.unwrap()
				.then(() => {
					handleSuccess(SUCCESS_MESSAGES.PASSWORD_UPDATED)
					if (closeModal) closeModal()
				})
				.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
		}
	}

	return (
		<Formik
			initialValues={{
				currentPassword: '',
				password: '',
				confirmPassword: '',
			}}
			validationSchema={updatePasswordSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5">
								<div>
									<Input
										id="user-profile-change-password-current-password"
										name="currentPassword"
										label="Mật khẩu hiện tại"
										isRequire={true}
										placeholder="Nhập mật khẩu hiện tại"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.currentPassword}
										error={touched.currentPassword && errors.currentPassword}
										hint={
											touched.currentPassword && errors.currentPassword
												? errors.currentPassword
												: ''
										}
										isPasswordField={true}
										showPassword={showCurrentPassword}
										setShowPassword={setShowCurrentPassword}
									/>
								</div>
								<div>
									<Input
										id="user-profile-change-password-password"
										name="password"
										label="Mật khẩu mới"
										isRequire={true}
										placeholder="Nhập mật khẩu mới"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.password}
										error={touched.password && errors.password}
										hint={touched.password && errors.password ? errors.password : ''}
										isPasswordField={true}
										showPassword={showPassword}
										setShowPassword={setShowPassword}
									/>
								</div>
								<div>
									<Input
										id="user-profile-change-password-confirm-password"
										name="confirmPassword"
										label="Xác nhận lại mật khẩu"
										isRequire={true}
										placeholder="Xác nhận lại mật khẩu"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.confirmPassword}
										error={touched.confirmPassword && errors.confirmPassword}
										hint={
											touched.confirmPassword && errors.confirmPassword
												? errors.confirmPassword
												: ''
										}
										isPasswordField={true}
										showPassword={showConfirmPassword}
										setShowPassword={setShowConfirmPassword}
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

export default UserProfileChangePasswordForm
