import { ActionTree, MutationTree, GetterTree } from 'vuex'

import { JSONFeedItem } from '@/types/jsonfeed'
import { PlaybackState, RootGetters, RootState } from '@/types/store'

import importSoundCloud from '@/import/SoundCloud'
import importYouTube from '@/import/YouTube'

//STATE

const state: PlaybackState = {
	id: null,
	paused: false,
	pendingUrl: null,
}

//MUTATIONS

const mutations: MutationTree<PlaybackState> = {
	SET_PLAYBACK_ID (state, id: string | null) {
		if (id === state.id) {
			state.paused = !state.paused
		} else {
			state.id = id
			state.paused = id === null
		}
	},

	TOGGLE_PAUSED (state, paused?: boolean) {
		state.paused = paused !== undefined ? paused : !state.paused
	},

	SET_PENDING_URL (state, url: string | null) {
		state.pendingUrl = url
	},
}

//ACTIONS

const actions: ActionTree<PlaybackState, any> = {
	PRESS_PAUSE ({ commit, dispatch, state }, paused?: boolean) {
		if (paused !== true && state.id === null) {
			dispatch('PLAY_SONG_INDEX', 0)
		} else {
			commit('TOGGLE_PAUSED', paused)
		}
	},

	SEEK_DIRECTION ({ dispatch, getters }, direction: number) {
		const playbackIndex = getters.playbackIndex
		dispatch('PLAY_SONG_INDEX', playbackIndex !== null ? playbackIndex + direction : null)
	},

	PLAY_SONG_INDEX ({ commit, rootGetters }, index: number | null) {
		const song = (index !== null && rootGetters.songs[index]) || null
		commit('SET_PLAYBACK_ID', song ? song.id : null)
	},

	QUEUE_PLAY_URL ({ commit, dispatch, getters }, url: string) {
		const songs = getters.songs as JSONFeedItem[]
		const loadedSongs = !!songs.length
		commit('SET_PENDING_URL', loadedSongs ? null : url)

		if (loadedSongs) {
			let id: string | null = null
			if (!importSoundCloud.isValid(url)) {
				const youtubeId = importYouTube.getIdFrom(url)
				if (youtubeId) {
					id = `yt:${youtubeId}`
				}
			}
			const songIndex = songs.findIndex(song => (id && song.id === id) || (song.external_url ? song.external_url.includes(url) : false)) //?.
			if (songIndex !== -1) {
				dispatch('PLAY_SONG_INDEX', songIndex)
				commit('TOGGLE_PAUSED', true)
			}
		}
	},
}

//GETTERS

const getters: GetterTree<PlaybackState, RootState> = {
	playbackIndex (state, getters: RootGetters): number | null {
		const id = state.id
		if (id) {
			const songIndex = getters.songs.findIndex(song => song.id === id)
			if (songIndex !== -1) {
				return songIndex
			}
		}
		return null
	},
}

//EXPORT

export default {
	state,
	mutations,
	actions,
	getters,
}
