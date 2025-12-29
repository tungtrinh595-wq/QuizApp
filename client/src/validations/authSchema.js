import * as Yup from 'yup'

export const loginSchema = Yup.object({
	email: Yup.string()
		.email('Email không hợp lệ')
		.required('Vui lòng nhập email'),
	password: Yup.string()
		.min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
		.max(20, 'Mật khẩu không được vượt quá 20 ký tự')
		.required('Vui lòng nhập mật khẩu'),
})

export const registerSchema = Yup.object({
	name: Yup.string()
		.min(2, 'Tên phải có ít nhất 2 ký tự')
		.max(30, 'Tên không được vượt quá 30 ký tự')
		.required('Vui lòng nhập tên'),
	email: Yup.string()
		.email('Email không hợp lệ')
		.required('Vui lòng nhập email'),
	password: Yup.string()
		.min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
		.max(20, 'Mật khẩu không được vượt quá 20 ký tự')
		.required('Vui lòng nhập mật khẩu'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
		.required('Vui lòng xác nhận mật khẩu'),
	termsAccepted: Yup.boolean()
		.oneOf([true], 'Bạn phải đồng ý với điều khoản và chính sách bảo mật')
		.required('Vui lòng xác nhận điều khoản'),
})

export const requestPasswordResetSchema = Yup.object({
	email: Yup.string()
		.email('Email không hợp lệ')
		.required('Vui lòng nhập email'),
})

export const resetPasswordSchema = Yup.object({
	password: Yup.string()
		.min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
		.max(20, 'Mật khẩu mới không được vượt quá 20 ký tự')
		.required('Vui lòng nhập mật khẩu'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
		.required('Vui lòng xác nhận mật khẩu'),
})
