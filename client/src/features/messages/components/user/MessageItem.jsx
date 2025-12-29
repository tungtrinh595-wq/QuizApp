import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { ReplyIcon, PencilIcon, TrashBinIcon } from '@/assets/icons'
import { formatDate, handleError, handleSuccess } from '@/utils'
import { useModal } from '@/hooks'
import { deleteMessage, MessageAddForm, MessageEditForm } from '@/features'
import { Button, Modal } from '@/components'

const MessageItem = ({ lessonId, msg, thread, allowReply = false }) => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)

	const [replyComment, setReplyComment] = useState(false)
	const [editComment, setEditComment] = useState(false)
	const {
		isOpen: isOpenDelete,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal()

	const confirmDeleteMessage = () => {
		dispatch(deleteMessage({ id: msg.id, lessonId, thread }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.MESSAGE_DELETED)
				closeDeleteModal()
			})
			.catch((error) => handleError(error, PREFIX.DELETE_FAILED))
	}

	return (
		<>
			{editComment && (
				<MessageEditForm
					msg={msg}
					lessonId={lessonId}
					thread={thread}
					closeForm={() => setEditComment(false)}
				/>
			)}
			{!editComment && (
				<div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] md:grid-rows-[auto] gap-x-3 gap-y-1 items-start w-full">
					<div className="row-span-1 md:row-span-2 w-15 h-15 overflow-hidden border border-gray-200 rounded-full">
						<img
							src={msg.createdBy?.avatar?.url}
							alt="avatar"
							className="w-full h-full object-cover"
						/>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<span className="font-medium text-brand-950 dark:text-white/90">
							{msg.createdBy?.name}
						</span>
						<span className="text-sm text-gray-500">{msg.createdBy?.email}</span>
						<span className="text-sm text-gray-500">
							{formatDate(msg.createdAt, 'D MMMM YYYY')}
						</span>
					</div>

					<div className="col-span-2 md:col-span-1 text-gray-800 dark:text-white/90 break-words">
						<p className="whitespace-pre-line">{msg.text}</p>

						<div className="flex gap-2">
							{allowReply && (
								<Button
									variant="clean"
									color="clean"
									size="sm"
									className="max-w-max"
									onClick={() => setReplyComment(true)}
									startIcon={
										<ReplyIcon className="fill-brand-950 dark:fill-white/50  group-hover:fill-brand-700 dark:group-hover:fill-white" />
									}
								>
									Trả lời
								</Button>
							)}
							{auth.me?.id === msg.createdBy?.id && (
								<Button
									variant="clean"
									color="clean"
									size="sm"
									className="max-w-max"
									onClick={() => setEditComment(true)}
									startIcon={
										<PencilIcon className="fill-brand-950 dark:fill-white/50 group-hover:fill-brand-700 dark:group-hover:fill-white" />
									}
								>
									Sửa
								</Button>
							)}
							{auth.me?.id === msg.createdBy?.id && (
								<Button
									variant="clean"
									color="clean"
									size="sm"
									className="max-w-max text-warning-700 hover:text-warning-800 dark:text-warning-600 dark:hover:text-warning-500"
									onClick={openDeleteModal}
									startIcon={
										<TrashBinIcon className="fill-warning-700 dark:fill-warning-600 group-hover:fill-warning-800 dark:group-hover:fill-warning-500" />
									}
								>
									Xóa
								</Button>
							)}
						</div>
						{replyComment && (
							<MessageAddForm
								lessonId={lessonId}
								parentMessageId={msg.id}
								thread={thread}
								closeForm={() => setReplyComment(false)}
							/>
						)}

						<Modal isOpen={isOpenDelete} onClose={closeDeleteModal} className="max-w-[700px] m-4">
							<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
								<div className="px-2 pr-14">
									<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
										Xác nhận xóa bình luận
									</h4>
									<div className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
										<p>Bạn có chắc muốn xóa bình luận này không?</p>
									</div>
								</div>
								<div className="flex justify-end gap-3 px-2 lg:mt-6">
									<Button size="md" variant="outline" color="gray" onClick={closeDeleteModal}>
										Đóng
									</Button>
									<Button
										onClick={confirmDeleteMessage}
										size="md"
										disabled={msg.isLoading}
										disableText="Đang xóa bình luận"
									>
										Xác nhận
									</Button>
								</div>
							</div>
						</Modal>
					</div>
				</div>
			)}
		</>
	)
}

export default MessageItem
