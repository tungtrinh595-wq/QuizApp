import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as xlsx from 'xlsx'

import { MAX_SIZE, PREFIX, QUESTION_TYPE, SUCCESS_MESSAGES } from '@/constants'
import { DownloadIcon } from '@/assets/icons'
import { getEnumLabel, handleSuccess, handleError } from '@/utils'
import { addQuizQuestions } from '@/features/quizzes'
import { Button, ComponentCard, FileInput, Tooltip } from '@/components'

const ExcelQuizImporter = ({ subjectId, quizId }) => {
	const inputRef = useRef(null)
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)
	const [questions, setQuestions] = useState([])
	const [error, setError] = useState(null)

	const mapQuestionTypeLabelToValue = (label) => {
		const entry = Object.values(QUESTION_TYPE).find((type) => type.label === label?.trim())
		return entry?.value || QUESTION_TYPE.MULTIPLE_CHOICE
	}

	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (!file) return

		const sizeMB = file.size / (1024 * 1024)
		if (sizeMB > MAX_SIZE) {
			setError(`Tệp quá lớn. Dung lượng tối đa cho phép là ${MAX_SIZE}MB.`)
			return
		}

		const reader = new FileReader()
		reader.onload = (evt) => {
			try {
				const data = new Uint8Array(evt.target.result)
				const workbook = xlsx.read(data, { type: 'array' })
				const sheet = workbook.Sheets[workbook.SheetNames[0]]
				const json = xlsx.utils.sheet_to_json(sheet)

				const parsed = json.map((row) => {
					const type = mapQuestionTypeLabelToValue(row['Loại câu hỏi'])
					const questionText = row['Câu hỏi'] || ''
					const explanation = row['Chú thích'] || ''
					const correctIndex = ['A', 'B', 'C', 'D'].indexOf(row['Đáp án đúng']?.trim())
					const options = [
						row['Phương án A'],
						row['Phương án B'],
						row['Phương án C'],
						row['Phương án D'],
					]
					const answers = options.reduce((acc, opt, index) => {
						const answer = String(opt ?? '').trim()
						if (answer !== '') acc.push({ answer, isCorrect: index === correctIndex })
						return acc
					}, [])

					return {
						subjectId,
						question: questionText,
						type,
						answers,
						explanation,
					}
				})

				setQuestions(parsed)
				setError(null)
			} catch (err) {
				setError('Không phân tích được tệp Excel.')
			}
		}

		reader.readAsArrayBuffer(file)
	}

	const handleImportQuestions = (questions) => {
		dispatch(addQuizQuestions({ subjectId, quizId, payload: { questions } }))
			.unwrap()
			.then(() => {
				setQuestions([])
				if (inputRef?.current) inputRef.current.value = ''
				handleSuccess(SUCCESS_MESSAGES.QUESTION_ADDED)
			})
			.catch((error) => handleError(error, PREFIX.ADD_FAILED))
	}

	const cancelImportQuestions = () => {
		setQuestions([])
		inputRef.current.value = ''
	}

	return (
		<ComponentCard title="📥 Nhập câu hỏi trắc nghiệm từ Excel">
			<div className="flex items-center gap-2">
				<span>File mẫu:</span>
				<Tooltip content="Questions">
					<a href="\defaults\Questions.xlsx" target="_blank" download="Questions">
						<DownloadIcon
							width={20}
							height={20}
							className="fill-brand-600 group-hover:fill-brand-800"
						/>
					</a>
				</Tooltip>
			</div>
			<FileInput
				ref={inputRef}
				onChange={handleFileChange}
				accept=".xlsx,.xls,.csv"
				error={!!error}
				hine={error}
			/>
			{questions.length > 0 && (
				<div>
					<h4 className="text-lg">Xem lại ({questions.length} câu hỏi)</h4>
					<ul className="mt-3">
						{questions.map((q, i) => (
							<li key={i}>
								<p className="font-semibold">
									{i + 1}. {q.question} ({getEnumLabel(QUESTION_TYPE, q.type)})
								</p>
								<ul>
									{q.answers.map((option, idx) => (
										<li key={idx} className={option.isCorrect ? 'font-medium' : ''}>
											{String.fromCharCode(65 + idx)}. {option.answer}
											{` `}
											{option.isCorrect && <span>(Đáp án đúng)</span>}
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
					<div className="flex items-center justify-end gap-3">
						<Button size="sm" variant="outline" color="gray" onClick={cancelImportQuestions}>
							Hủy bỏ
						</Button>
						<Button
							size="sm"
							onClick={() => handleImportQuestions(questions)}
							disabled={quizzes.isLoading}
						>
							Thêm vào đề thi
						</Button>
					</div>
				</div>
			)}
		</ComponentCard>
	)
}

export default ExcelQuizImporter
