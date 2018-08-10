//eslint-disable-next-line no-unused-vars
import { ActionTree, MutationTree, GetterTree } from 'vuex'

//eslint-disable-next-line no-unused-vars
import { PlaybackState, RootState } from '@/types/store'

//STATE

const state: PlaybackState = {
	url: null,
	paused: false,
}

//MUTATIONS

const mutations: MutationTree<PlaybackState> = {
	SET_PLAYBACK_URL (state, url) {
		if (url === state.url) {
			state.paused = !state.paused
		} else {
			state.url = url
			state.paused = false
		}
	},

	TOGGLE_PAUSED (state, paused: boolean | undefined) {
		state.paused = paused !== undefined ? paused : !state.paused
	},
}

//ACTIONS

const actions: ActionTree<PlaybackState, any> = {
	PRESS_PAUSE ({ commit, dispatch, state }, paused) {
		if (state.url === null) {
			dispatch('PLAY_SONG_INDEX', 0)
		} else {
			commit('TOGGLE_PAUSED', paused)
		}
	},

	SEEK_DIRECTION ({ dispatch, getters }, direction) {
		const playbackIndex = getters.playbackIndex
		if (playbackIndex !== null) {
			dispatch('PLAY_SONG_INDEX', playbackIndex + direction)
		}
	},

	PLAY_SONG_INDEX ({ commit, rootGetters }, index) {
		if (index === null) {
			return commit('TOGGLE_PAUSED', true)
		}
		const song = rootGetters.songs[index]
		if (song) {
			commit('SET_PLAYBACK_URL', song.url || song.external_url)
		}
	},
}

//GETTERS

const getters: GetterTree<PlaybackState, any> = {
	playbackIndex (state, getters): number | null {
		const url = state.url
		if (url) {
			const songs = getters.songs
			for (let idx = songs.length - 1; idx >= 0; idx -= 1) {
				const song = songs[idx]
				const songUrl = song.url || song.external_url
				if (!songUrl) {
					continue
				}
				if (songUrl === url) {
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
