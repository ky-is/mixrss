import { JSONFeed, JSONFeedItem } from '@/types/jsonfeed'

export interface FeedState {
	list: string[]
	url: string | null
	data: JSONFeed | null
	modified: boolean
	selectedTagIds: string[]
	loading: number
}

export interface LocalState {
	author: string | null
	addingFeed: boolean
	toggleSidebar: boolean
}

export interface PlaybackState {
	id: string | null
	paused: boolean
	pendingUrl: string | null
}

export interface RootState {
	feed: FeedState
	local: LocalState
	playback: PlaybackState
}

export interface RootGetters {
	//FEED
	feedForUrl: JSONFeedItem | null,
	songs: JSONFeedItem[]
	//LOCAL
	showsSidebar: boolean
	//PLAYBACK
	playbackIndex: number | null
}
