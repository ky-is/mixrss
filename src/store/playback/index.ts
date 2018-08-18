import { ActionTree, MutationTree, GetterTree } from 'vuex'

import { PlaybackState } from '@/types/store'

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

	QUEUE_PLAY_URL ({ commit, dispatch, getters }, url) {
		const songs = getters.songs
		const loadedSongs = !!songs.length
		commit('SET_PENDING_URL', loadedSongs ? null : url)

		if (loadedSongs) {
			let id = null
			if (!importSoundCloud.isValid(url)) {
				const youtubeId = importYouTube.getIdFrom(url)
				if (youtubeId) {
					id = `yt:${youtubeId}`
				}
			}
			for (let index = songs.length - 1; index >= 0; index -= 1) {
				const song = songs[index]
				if (song.external_url.includes(url) || (id && song.id === id)) {
					dispatch('PLAY_SONG_INDEX', index)
					commit('TOGGLE_PAUSED', true)
					break
				}
			}
		}
	},
}

//GETTERS

const getters: GetterTree<PlaybackState, any> = {
	playbackIndex (state, getters): number | null {
		const id = state.id
		if (id) {
			const songs = getters.songs
			for (let idx = songs.length - 1; idx >= 0; idx -= 1) {
				const song = songs[idx]
				if (id === song.id) {
					return idx
				}
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
