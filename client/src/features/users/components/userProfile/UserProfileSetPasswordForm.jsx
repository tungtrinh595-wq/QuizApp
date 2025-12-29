import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'

import { PREFIX, ROUTES, SUCCESS_MESSAGES } from '@/constants'
import { setPasswordSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { setPassword, setUserPassword } from '@/features'
import { Input, Button } from '@/components'

const UserProfileSetPasswordForm = ({ userId, closeModal, authToken }) => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)
	const users = useSelector((state) => state.users)

	const profile = users.profiles?.[userId]
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const isSelfUpdate = profile?.id === auth.me?.id
	const isResetFlow = !!authToken
	const navigate = useNavigate()

	const handleSubmit = (values) => {
		if (isSelfUpdate || isResetFlow) {
			dispatch(setPassword({ formData: values, authToken }))
				.unwrap()
				.then(() => {
					handleSuccess(SUCCESS_MESSAGES.PASSWORD_UPDATED)
					if (closeModal) closeModal()
					if (authToken) navigate(ROUTES.HOME)
				})
				.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
		} else {
			dispatch(setUserPassword({ id: profile?.id, formData: values }))
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
				password: '',
				confirmPassword: '',
			}}
			validationSchema={setPasswordSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5">
								<div>
									<Input
										id="user-profile-set-password-password"
										name="password"
										label="Mật khẩu"
										isRequire={true}
										placeholder="Nhập mật khẩu"
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
										id="user-profile-set-password-confirm-password"
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

					<div
						className={`flex items-center gap-3 px-2 mt-6 ${
							authToken ? 'flex-col' : 'lg:justify-end'
						}`}
					>
						{authToken ? (
							<Button className="w-full" size="md" disabled={auth.isLoading} type="submit">
								Xác nhận
							</Button>
						) : (
							<>
								<Button size="md" variant="outline" color="gray" onClick={closeModal}>
									Đóng
								</Button>
								<Button size="md" disabled={users.isLoading} type="submit">
									Lưu
								</Button>
							</>
						)}
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default UserProfileSetPasswordForm
