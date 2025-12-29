import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { CloseModalIcon } from '@/assets/icons'

const Modal = ({
	isOpen,
	onClose,
	children,
	className,
	showCloseButton = true,
	isFullscreen = false,
}) => {
	const modalRef = useRef(null)

	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
		}
		return () => {
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'unset'
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	const contentClasses = isFullscreen
		? 'w-full h-full'
		: 'relative w-full rounded-3xl bg-white dark:bg-gray-900'

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999"
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
				>
					{!isFullscreen && (
						<motion.div
							className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
							onClick={onClose}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						/>
					)}

					<motion.div
						ref={modalRef}
						className={`${contentClasses} ${className}`}
						onClick={(e) => e.stopPropagation()}
						initial={{ y: -50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -50, opacity: 0 }}
						transition={{ duration: 0.1, ease: 'easeOut' }}
					>
						{showCloseButton && (
							<button
								onClick={onClose}
								className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
							>
								<CloseModalIcon />
							</button>
						)}
						<div>{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
