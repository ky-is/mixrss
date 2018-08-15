//eslint-disable-next-line no-unused-vars
import { ActionTree, MutationTree, GetterTree } from 'vuex'

//eslint-disable-next-line no-unused-vars
import { PlaybackState, RootState } from '@/types/store'

//STATE

const state: PlaybackState = {
	id: null,
	paused: false,
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
