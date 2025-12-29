import React from 'react'

import { getDynamicClasses, sanitizeHtml } from '@/utils'

const SafeHtmlContent = ({ content, className }) => {
	const sanitizedHtml = sanitizeHtml(content)

	const contentClasses = getDynamicClasses({ baseClasses: 'prose-content' }, { className })

	return <div className={contentClasses} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default SafeHtmlContent
