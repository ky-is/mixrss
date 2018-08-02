//eslint-disable-next-line no-unused-vars
import { ActionTree, MutationTree, GetterTree } from 'vuex'

//eslint-disable-next-line no-unused-vars
import { PlaybackState } from '@/types/store'

//STATE

const state: PlaybackState = {
	index: null,
	paused: false,
}

//MUTATIONS

const mutations: MutationTree<PlaybackState> = {
	SET_INDEX (state, index) {
		if (index === state.index) {
			state.paused = !state.paused
		} else {
			state.index = index
		}
	},

	TOGGLE_PAUSED (state) {
		if (state.index === null) {
			state.index = 0
		} else {
			state.paused = !state.paused
		}
	},

	SEEK_DIRECTION (state, direction) {
		if (state.index === null) {
			return
		}
		state.index += direction
	},

	CLEAR_PLAYBACK (state) {
		state.index = null
		state.paused = false
	},
}

//ACTIONS

const actions: ActionTree<PlaybackState, any> = {
}

//GETTERS

const getters: GetterTree<PlaybackState, any> = {
	hasNextSong (state, getters): boolean {
		const playbackIndex = state.index
		return playbackIndex !== null && playbackIndex < getters.songs.length - 1
	},
}

//EXPORT

export default {
	state,
	mutations,
	actions,
	getters,
}
