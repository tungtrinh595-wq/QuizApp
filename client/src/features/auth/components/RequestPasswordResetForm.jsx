import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { requestPasswordResetSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { Input, Button } from '@/components'
import { requestPasswordReset } from '@/features'

const RequestPasswordResetForm = () => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)

	const handleSubmit = (values, actions) => {
		dispatch(requestPasswordReset({ formData: values }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.REQUEST_PASSWORD_SEND)
				actions.resetForm()
			})
			.catch((error) => handleError(error, PREFIX.REQUEST_FAILED))
	}

	return (
		<Formik
			initialValues={{ email: '' }}
			validationSchema={requestPasswordResetSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur }) => (
				<Form className="space-y-5">
					<div>
						<Input
							id="request-password-reset-email"
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
						<Button size="md" className="w-full" disabled={auth.isLoading} type="submit">
							Gửi yêu cầu
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default RequestPasswordResetForm
