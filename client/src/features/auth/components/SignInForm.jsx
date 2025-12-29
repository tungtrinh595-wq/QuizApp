import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'

import { PREFIX, ROUTES } from '@/constants'
import { loginSchema } from '@/validations'
import { handleError, handleRedirectAfterLogin } from '@/utils'
import { loginWithEmail } from '@/features'
import { Input, Button, Checkbox } from '@/components'

const SignInForm = () => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)

	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)

	const handleSubmit = ({ keepMeLogin, ...values }) => {
		dispatch(loginWithEmail({ navigate, formData: values, keepMeLogin }))
			.unwrap()
			.then(({ me }) => handleRedirectAfterLogin(navigate, me.role))
			.catch((error) => handleError(error, PREFIX.LOGIN_FAILED))
	}

	if (auth.isAuthenticated) return <Navigate to="/" replace />

	return (
		<Formik
			initialValues={{
				email: '',
				password: '',
				keepMeLogin: false,
			}}
			validationSchema={loginSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
				<Form className="space-y-6">
					<div>
						<Input
							id="signin-email"
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
							id="signin-password"
							name="password"
							label="Mật khẩu"
							isRequire={true}
							placeholder="Nhập mật khẩu của bạn"
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

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Checkbox
								id="signin-keep-me-login"
								className="w-5 h-5"
								name="keepMeLogin"
								checked={values.keepMeLogin}
								onChange={(value) => setFieldValue('keepMeLogin', value)}
								label={
									<span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
										Giữ trạng thái đăng nhập
									</span>
								}
							/>
						</div>
						<Link
							to={ROUTES.FORGOT_PASSWORD}
							className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
						>
							Quên mật khẩu?
						</Link>
					</div>

					<div>
						<Button className="w-full" size="md" disabled={auth.isLoading} type="submit">
							Đăng nhập
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default SignInForm
