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
