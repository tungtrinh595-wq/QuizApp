import { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'

import { getHintClasses, sanitizeHtml } from '@/utils'
import { Label, Spinner } from '@/components'

const ContentEditor = ({
	id,
	value,
	label,
	isRequire = false,
	onChange,
	success = false,
	error = false,
	hint,
	height = 500,
}) => {
	const [isEditorReady, setIsEditorReady] = useState(false)
	const hintClasses = getHintClasses({ error, success })
	const [content, setContent] = useState(value || '')

	const handleChangeContent = (newContent) => {
		setContent(newContent)
		const cleanValue = sanitizeHtml(newContent)
		onChange(cleanValue)
	}

	return (
		<>
			{label && (
				<Label htmlFor={id}>
					{label} {isRequire && <span className="text-error-500">*</span>}
				</Label>
			)}
			<div className="relative">
				{!isEditorReady && (
					<div className="absolute top-0 left-0 z-1 w-full h-full flex items-center justify-center bg-white">
						<Spinner />
					</div>
				)}
				<Editor
					apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
					id={id}
					value={content}
					init={{
						height,
						menubar: true,
						plugins: [
							'advlist',
							'anchor',
							'autolink',
							'autosave',
							'charmap',
							'code',
							'directionality',
							'emoticons',
							'help',
							'image',
							'insertdatetime',
							'link',
							'lists',
							'media',
							'nonbreaking',
							'pagebreak',
							'preview',
							'searchreplace',
							'table',
							'visualblocks',
							'visualchars',
							'wordcount',
						],
						toolbar:
							'undo redo  | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link unlink image | align lineheight bullist numlist | indent outdent | removeformat | code',
						font_family_formats:
							'Arial=arial,helvetica,sans-serif; Courier=courier new,courier,monospace;',
						block_formats:
							'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
						fontsize_formats: '8px 10px 12px 14px 18px 24px 36px',
					}}
					onEditorChange={(content) => handleChangeContent(content)}
					onInit={() => setIsEditorReady(true)}
				/>

				{hint && <p className={hintClasses}>{hint}</p>}
			</div>
		</>
	)
}

export default ContentEditor
