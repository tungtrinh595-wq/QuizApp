export const LESSON_STATUS = {
	DRAFT: { value: 'draft', label: 'Bản nháp' },
	PUBLISHED: { value: 'published', label: 'Chính thức' },
}

export const QUIZ_TYPE = {
	EXAM: { value: 'exam', label: 'Thi' },
	PRACTICE: { value: 'practice', label: 'Thi thử' },
	SURVEY: { value: 'survey', label: 'Khảo sát' },
}

export const QUIZ_RANDOM = {
	FIXED: { value: 'fixed', label: 'Cố định' },
	RANDOM: { value: 'random', label: 'Ngẫu nhiên' },
}

export const QUESTION_TYPE = {
	MULTIPLE_CHOICE: { value: 'multiple-choice', label: 'Chọn đáp án' },
	FILL_IN: { value: 'fill-in', label: 'Điền đáp án' },
}

export const RESULT_STATUS = {
	PASS: { value: 'pass', label: 'Đậu' },
	FAIL: { value: 'fail', label: 'Rớt' },
}

export const SOCKET_ROOM_TYPE = {
	SUBJECT: 'subject',
	LESSON: 'lesson',
	QUIZ: 'quiz',
}

export const UPLOADER = {
	GOOGLE_DRIVE: 'google_drive',
	CLOUDINARY: 'cloudinary',
}
