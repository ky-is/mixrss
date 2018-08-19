export interface JSONFeed {
	version: string
	feed_url?: string
	title: string
	icon?: string
	author?: JSONFeedAuthor
	items?: JSONFeedItem[]
}

export interface JSONFeedItem {
	id: string
	title?: string
	author?: JSONFeedAuthor
	content_text?: string
	content_html?: string
	_duration?: string
	url?: string
	external_url?: string
	image?: string
	_imageAlign?: string,
	summary?: string
	date_published: string
	date_modified?: string
	tags?: string[]
}

export interface JSONFeedAuthor {
	name: string
}
