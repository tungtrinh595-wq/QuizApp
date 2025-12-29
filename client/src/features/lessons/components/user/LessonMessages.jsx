import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PREFIX } from '@/constants'
import { handleError } from '@/utils'
import { getMessages, MessagesTree, MessageAddForm } from '@/features'
import { Button, ComponentCard } from '@/components'

const LessonMessages = ({ lessonId }) => {
	const dispatch = useDispatch()
	const messages = useSelector((state) => state.messages)
	const hasFetched = useRef(false)
	const lessonMessages = lessonId ? messages.lessonMap?.[lessonId] : null
	const listMessages = lessonMessages?.messages || []

	useEffect(() => {
		if (!hasFetched.current && !lessonMessages) {
			dispatch(getMessages({ lessonId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			hasFetched.current = true
		}
	}, [listMessages])

	const handleLoadMore = (cursor) => {
		dispatch(getMessages({ lessonId, cursor }))
			.unwrap()
			.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
	}

	return (
		<ComponentCard title="Bình luận">
			<MessageAddForm lessonId={lessonId} />
			<MessagesTree lessonId={lessonId} messages={listMessages} />
			{lessonMessages?.hasMore && (
				<Button onClick={() => handleLoadMore(lessonMessages?.nextCursor)}>Xem thêm</Button>
			)}
		</ComponentCard>
	)
}

export default LessonMessages
