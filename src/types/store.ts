export interface FeedState {
	url: string | null
	data: JSONFeed | null
	modified: boolean
}

export interface LocalState {
	author: string | null
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
