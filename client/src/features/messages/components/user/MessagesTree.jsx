import { MAX_DEPTH } from '@/constants'
import { MessageItem } from '@/features'

const MessagesTree = ({ lessonId, messages = [], depth = 0, thread = [] }) => {
	if (depth > MAX_DEPTH) return null

	return (
		<div className="space-y-3">
			{messages?.map((msg) => (
				<div className={`space-y-5 ${depth > 0 ? 'ml-5 md:ml-15' : ''}`} key={msg.id}>
					<MessageItem
						lessonId={lessonId}
						msg={msg}
						thread={[...thread, msg.id]}
						allowReply={depth < MAX_DEPTH}
					/>
					{msg.replies && (
						<MessagesTree
							lessonId={lessonId}
							messages={msg.replies}
							depth={depth + 1}
							thread={[...thread, msg.id]}
						/>
					)}
				</div>
			))}
		</div>
	)
}

export default MessagesTree
