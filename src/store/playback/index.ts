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

	TOGGLE_PAUSED (state, paused) {
		if (state.index === null) {
			state.index = 0
		} else {
			const pausing = paused !== undefined ? paused : !state.paused
			state.paused = pausing
		}
	},

	SEEK_DIRECTION (state, direction) {
		if (state.index === null) {
			return
		}
		state.index += direction
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
