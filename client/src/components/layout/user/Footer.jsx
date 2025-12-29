import { FacebookIcon } from '@/assets/icons'

const Footer = () => {
	return (
		<div className="bg-brand-500">
			<div className="w-full max-w-screen-2xl mx-auto flex flex-col justify-between py-6 lg:px-6 sm:flex-row">
				<p className="text-center font-body text-white md:text-left">
					© Bản quyền {new Date().getFullYear()} - QuizApp.
				</p>
				<div className="flex items-center justify-center gap-4 pt-5 sm:justify-start sm:pt-0">
					<a
						href="https://www.facebook.com/TH55132230"
						target="_blank"
						className="text-white"
					>
						<FacebookIcon />
					</a>
				</div>
			</div>
		</div>
	)
}

export default Footer
