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
	SET_PLAYBACK_URL (state, url: string | null) {
		if (url === state.url) {
			state.paused = !state.paused
		} else {
			state.url = url
			state.paused = url === null
		}
	},

	TOGGLE_PAUSED (state, paused?: boolean) {
		state.paused = paused !== undefined ? paused : !state.paused
	},
}

//ACTIONS

const actions: ActionTree<PlaybackState, any> = {
	PRESS_PAUSE ({ commit, dispatch, state }, paused?: boolean) {
		if (state.url === null) {
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
		const song = (index && rootGetters.songs[index]) || null
		commit('SET_PLAYBACK_URL', song ? song.url || song.external_url : null)
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
