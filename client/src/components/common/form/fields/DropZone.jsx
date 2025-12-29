import { useDropzone } from 'react-dropzone'

import { MAX_FILES, MAX_SIZE } from '@/constants'
import { ShareIcon } from '@/assets/icons'
import { getDynamicClasses, handleError } from '@/utils'
import { ComponentCard, Spinner } from '@/components'

const Dropzone = ({ title = '', onDropFiles, isLoading = false }) => {
	const onDrop = (acceptedFiles) => {
		if (acceptedFiles.length > 0) onDropFiles(acceptedFiles)
		else handleError('Tập tin đính kèm không hợp lệ')
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/png': [],
			'image/jpg': [],
			'image/jpeg': [],
			'image/gif': [],
			'text/csv': [],
			'application/pdf': [],
			'application/msword': [],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
			'application/vnd.ms-excel': [],
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
			'application/vnd.ms-powerpoint': [],
			'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
			'application/zip': [],
			'application/x-rar': [],
			'application/x-rar-compressed': [],
			'application/octet-stream': [],
		},
		maxFiles: MAX_FILES,
		maxSize: MAX_SIZE * 1024 * 1024,
	})

	const dropzoneClasses = getDynamicClasses({
		baseClasses: 'dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10',
		stateClasses: [
			{ class: 'border-brand-500 bg-gray-100 dark:bg-gray-800', condition: isDragActive },
			{
				class: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900',
				condition: !isDragActive,
			},
		],
	})

	return (
		<ComponentCard title={title}>
			<div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
				<div {...getRootProps()} className={dropzoneClasses}>
					{!isLoading && <input {...getInputProps()} />}

					{isLoading ? (
						<div className="min-h-[256px] flex flex-col items-center justify-center gap-2 dark:text-white/90">
							<Spinner />
							<p>Đang tải dữ liệu lên...</p>
						</div>
					) : (
						<div className="dz-message flex flex-col items-center m-0!">
							<div className="mb-[22px] flex justify-center">
								<div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
									<ShareIcon />
								</div>
							</div>

							<h4 className="mb-3 font-semibold text-gray-800 dark:text-white/90 text-theme-xl">
								{isDragActive ? 'Thả file vào đây' : 'Kéo & thả hoặc chọn file'}
							</h4>

							<span className=" text-center block w-full max-w-[350px] text-sm text-gray-700 dark:text-gray-400">
								Kéo & thả hoặc chọn file
								<br />
								Kéo vào đây các file ảnh PNG, JPG, JPEG, GIF,
								<br />
								hoặc tài liệu MS Word, MS Excel, MS PowerPoint, CSV
								<br />
								các file nén định dạng Zip, Rar của bạn,
								<br />
								hoặc bấm vào{' '}
								<span className="font-medium underline text-theme-sm text-brand-500">
									Duyệt tập tin
								</span>{' '}
								để chọn file.
							</span>
							<p className="mt-2 text-xs text-gray-700 dark:text-gray-400">
								(Giới hạn kích thước mỗi tập tin: {MAX_SIZE}MB và tối đa {MAX_FILES} tâp tin mỗi lần
								thêm)
							</p>
						</div>
					)}
				</div>
			</div>
		</ComponentCard>
	)
}

export default Dropzone
