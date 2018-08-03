//eslint-disable-next-line
import { ActionTree, MutationTree, GetterTree } from 'vuex'

import storage from '@/helpers/storage'
//eslint-disable-next-line no-unused-vars
import { LocalState } from '@/types/store'

//STATE

const state: LocalState = {
	author: storage.get('AUTHOR'),

	addingFeed: false,
}

//MUTATIONS

const mutations: MutationTree<LocalState> = {
	SET_AUTHOR (state, author) {
		state.author = author
		storage.set('AUTHOR', author)
	},

	TOGGLE_ADD_FEED (state, show) {
		state.addingFeed = show === undefined ? !state.addingFeed : show
	},
}

//ACTIONS

const actions: ActionTree<LocalState, any> = {
}

//GETTERS

const getters: GetterTree<LocalState, any> = {
}

//EXPORT

export default {
	state,
	mutations,
	actions,
	getters,
}
