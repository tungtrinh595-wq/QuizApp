import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { registerSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { Input, Button, Checkbox } from '@/components'
import { registerUserWithEmail } from '@/features'

const SignUpForm = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleSubmit = ({ termsAccepted, ...values }) => {
		dispatch(registerUserWithEmail({ formData: values }))
			.unwrap()
			.then(({ me }) => {
				handleSuccess(SUCCESS_MESSAGES.SIGNUP)
				handleRedirectAfterLogin(navigate, me.role)
			})
			.catch((error) => handleError(error, PREFIX.LOGIN_FAILED))
	}

	if (auth.isAuthenticated) return <Navigate to="/" />

	return (
		<Formik
			initialValues={{
				name: '',
				email: '',
				password: '',
				confirmPassword: '',
				termsAccepted: false,
			}}
			validationSchema={registerSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
				<Form className="space-y-5">
					<div>
						<Input
							id="signup-name"
							name="name"
							label="Họ và tên"
							isRequire={true}
							placeholder="Nhập họ và tên của bạn"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.name}
							error={touched.name && errors.name}
							hint={touched.name && errors.name ? errors.name : ''}
						/>
					</div>
					<div>
						<Input
							id="signup-email"
							name="email"
							label="Email"
							isRequire={true}
							placeholder="Nhập email của bạn"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.email}
							error={touched.email && errors.email}
							hint={touched.email && errors.email ? errors.email : ''}
						/>
					</div>
					<div>
						<Input
							id="signup-password"
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
							id="signup-confirm-password"
							name="confirmPassword"
							label="Xác nhận mật khẩu"
							isRequire={true}
							placeholder="Xác nhận mật khẩu"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.confirmPassword}
							error={touched.confirmPassword && errors.confirmPassword}
							hint={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
							isPasswordField={true}
							showPassword={showConfirmPassword}
							setShowPassword={setShowConfirmPassword}
						/>
					</div>
					<div>
						<Checkbox
							id="signup-terms-accepted"
							className="w-5 h-5"
							name="termsAccepted"
							checked={values.termsAccepted}
							onChange={(value) => setFieldValue('termsAccepted', value)}
							label={
								<span className="font-normal text-gray-500 dark:text-gray-400">
									Bằng việc tạo tài khoản, bạn đồng ý với{' '}
									<span className="text-gray-800 dark:text-white/90">Điều khoản sử dụng</span> và{' '}
									<span className="text-gray-800 dark:text-white">Chính sách bảo mật</span>
								</span>
							}
							isRequire={true}
							value={values.termsAccepted}
							error={touched.termsAccepted && errors.termsAccepted}
							hint={touched.termsAccepted && errors.termsAccepted ? errors.termsAccepted : ''}
						/>
					</div>
					<div>
						<Button className="w-full" size="md" disabled={auth.isLoading} type="submit">
							Đăng ký
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default SignUpForm
