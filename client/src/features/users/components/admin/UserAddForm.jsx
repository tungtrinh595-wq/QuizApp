import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { ROLE, PREFIX, SUCCESS_MESSAGES, DEFAULT } from '@/constants'
import { addUserSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { addUser } from '@/features'
import { Input, Button, TextArea, Select, ImageField } from '@/components'

const UserAddForm = ({ closeModal }) => {
	const dispatch = useDispatch()
	const users = useSelector((state) => state.users)
	const [fileAvatar, setFileAvatar] = useState()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleSubmit = (values) => {
		const formData = new FormData()
		Object.entries(values).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, value)
			}
		})
		if (fileAvatar) formData.append('image', fileAvatar)

		dispatch(addUser({ formData }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.USER_ADDED)
				if (closeModal) closeModal()
			})
			.catch((error) => handleError(error, PREFIX.ADD_FAILED))
	}

	return (
		<Formik
			initialValues={{
				email: '',
				name: '',
				bio: '',
				role: ROLE.USER.value,
				password: '',
				confirmPassword: '',
			}}
			validationSchema={addUserSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
								<div>
									<ImageField
										id="user-add-image"
										initImage={DEFAULT.AVATAR}
										onChange={setFileAvatar}
										shape="round"
									/>
								</div>
								<div>
									<Input
										id="user-add-email"
										name="email"
										label="Địa chỉ Email"
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
										id="user-add-name"
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
									<Select
										id="user-add-role"
										name="role"
										label="Vai trò"
										placeholder="Lựa chọn vai trò"
										onChange={(value) => setFieldValue('role', value)}
										onBlur={handleBlur}
										value={values.role}
										options={Object.values(ROLE)}
										error={touched.role && errors.role}
										hint={touched.role && errors.role ? errors.role : ''}
									/>
								</div>
								<div className="col-span-1 lg:col-span-2">
									<TextArea
										id="user-add-bio"
										name="bio"
										label="Giới thiệu bản thân"
										placeholder="Viết một mô tả về người dùng"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.bio}
										error={touched.bio && errors.bio}
										hint={touched.bio && errors.bio ? errors.bio : ''}
									/>
								</div>
								<div>
									<Input
										id="user-add-password"
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
										id="user-add-confirm-password"
										name="confirmPassword"
										label="Xác nhận mật khẩu"
										isRequire={true}
										placeholder="Xác nhận mật khẩu"
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

export default UserAddForm
