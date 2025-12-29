import slugify from 'slugify'

export const attachSlug =
	(paramName = 'title') =>
	async (req, res, next) => {
		let base = ''
		switch (paramName) {
			case 'email':
				base = req.body.email?.split('@')[0]
				break

			case 'title':
			default:
				base = req.body.title
				break
		}
		if (!base) throw new BadRequestError('Không thể thêm slug')

		req.body.slug = slugify(base, { lower: true, strict: true })
		next()
	}
