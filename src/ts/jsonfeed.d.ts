declare interface JSONFeed {
	version: string
	feed_url: string
	title: string
	icon: string?
	author?: JSONFeedAuthor
	items?: JSONFeedItem[]
}

declare interface JSONFeedItem {
	id: string
	title?: string
	author?: JSONFeedAuthor
	duration?: string
	url?: string
	external_url?: string
	image?: string
	summary?: string
	date_published: string
	date_modified?: string
}

declare interface JSONFeedAuthor {
	name: string
}
