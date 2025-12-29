import * as Yup from 'yup'
import { ROLE } from '@/constants'

export const editProfileSchema = Yup.object({
	email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
	name: Yup.string()
		.min(2, 'Tên phải có ít nhất 2 ký tự')
		.max(30, 'Tên không được vượt quá 30 ký tự')
		.required('Vui lòng nhập tên'),
	bio: Yup.string().optional(),
})

export const updatePasswordSchema = Yup.object({
	currentPassword: Yup.string()
		.min(6, 'Mật khẩu hiện tại phải có ít nhất 6 ký tự')
		.max(20, 'Mật khẩu hiện tại không được vượt quá 20 ký tự')
		.required('Vui lòng nhập mật khẩu hiện tại'),
	password: Yup.string()
		.min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
		.max(20, 'Mật khẩu mới không được vượt quá 20 ký tự')
		.required('Vui lòng nhập mật khẩu mới'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
		.required('Vui lòng xác nhận mật khẩu mới'),
})

export const setPasswordSchema = Yup.object({
	password: Yup.string()
		.min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
		.max(20, 'Mật khẩu không được vượt quá 20 ký tự')
		.required('Vui lòng nhập mật khẩu'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
		.required('Vui lòng xác nhận mật khẩu'),
})

export const addUserSchema = Yup.object({
	email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
	name: Yup.string()
		.min(2, 'Tên phải có ít nhất 2 ký tự')
		.max(30, 'Tên không được vượt quá 30 ký tự')
		.required('Vui lòng nhập tên'),
	role: Yup.string()
		.oneOf(
			Object.values(ROLE).map((s) => s.value),
			'Vai trò không hợp lệ'
		)
		.required('Vui lòng chọn 1 vai trò'),
	bio: Yup.string().optional(),
	password: Yup.string()
		.min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
		.max(20, 'Mật khẩu mới không được vượt quá 20 ký tự')
		.required('Vui lòng nhập mật khẩu'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
		.required('Vui lòng xác nhận mật khẩu'),
})

export const editUserSchema = Yup.object({
	email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
	name: Yup.string()
		.min(2, 'Tên phải có ít nhất 2 ký tự')
		.max(30, 'Tên không được vượt quá 30 ký tự')
		.required('Vui lòng nhập tên'),
	role: Yup.string()
		.oneOf(
			Object.values(ROLE).map((s) => s.value),
			'Vai trò không hợp lệ'
		)
		.required('Vui lòng chọn 1 vai trò'),
	bio: Yup.string().optional(),
})
