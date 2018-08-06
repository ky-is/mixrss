export interface FeedState {
	list: string[]
	url: string | null
	data: JSONFeed | null
	modified: boolean
	selectedTagIds: string[]
}

export interface LocalState {
	author: string | null
	addingFeed: boolean
}

export interface PlaybackState {
	index: number | null
	paused: boolean
}

export interface RootState {
	feed: FeedState
	local: LocalState
	playback: PlaybackState
}
