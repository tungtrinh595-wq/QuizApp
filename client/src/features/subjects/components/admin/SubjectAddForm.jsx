import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { subjectSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { createSubject } from '@/features'
import { Input, Button, ImageField } from '@/components'

const SubjectAddForm = ({ closeModal }) => {
	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)

	const [fileImage, setFileImage] = useState()

	const handleSubmit = (values) => {
		const formData = new FormData()
		Object.entries(values).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, value)
			}
		})
		if (fileImage) {
			formData.append('image', fileImage)
		}
		dispatch(createSubject({ formData }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.SUBJECT_ADDED)
				if (closeModal) closeModal()
			})
			.catch((error) => handleError(error, PREFIX.ADD_FAILED))
	}

	return (
		<Formik
			initialValues={{
				title: '',
				description: '',
			}}
			validationSchema={subjectSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5">
								<div>
									<ImageField id="subject-add-image" onChange={setFileImage} />
								</div>
								<div>
									<Input
										id="subject-add-title"
										name="title"
										label="Tên môn học"
										isRequire={true}
										placeholder="Nhập tên môn học"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.title}
										error={touched.title && errors.title}
										hint={touched.title && errors.title ? errors.title : ''}
									/>
								</div>
								<div>
									<Input
										id="subject-add-description"
										name="description"
										label="Mô tả"
										placeholder="Nhập mô tả cho môn học"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.description}
										error={touched.description && errors.description}
										hint={touched.description && errors.description ? errors.description : ''}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeModal}>
							Đóng
						</Button>
						<Button size="md" disabled={subjects.isLoading} type="submit">
							Lưu
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default SubjectAddForm
