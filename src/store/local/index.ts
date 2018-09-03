import { ActionTree, MutationTree, GetterTree } from 'vuex'

import storage from '@/helpers/storage'

import { LocalState, RootGetters, RootState } from '@/types/store'

//STATE

const state: LocalState = {
	author: storage.get('AUTHOR'),

	addingFeed: false,
	toggleSidebar: false,
}

//MUTATIONS

const mutations: MutationTree<LocalState> = {
	SET_AUTHOR (state, author: string) {
		state.author = author
		storage.set('AUTHOR', author)
	},

	TOGGLE_ADD_FEED (state, show?: boolean) {
		state.addingFeed = show === undefined ? !state.addingFeed : show
	},

	TOGGLE_SIDEBAR (state, show?: boolean) {
		state.toggleSidebar = show === undefined ? !state.toggleSidebar : show
	},
}

//ACTIONS

const actions: ActionTree<LocalState, any> = {
}

//GETTERS

const getters: GetterTree<LocalState, RootState> = {
	showsSidebar (state, getters: RootGetters, rootState): boolean {
		return state.toggleSidebar && rootState.feed.data !== null
	},
}

//EXPORT

export default {
	state,
	mutations,
	actions,
	getters,
}
