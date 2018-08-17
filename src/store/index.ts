import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from '@/types/store'

import feed from './feed'
import local from './local'
import playback from './playback'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
	strict: process.env.NODE_ENV !== 'production',

	modules: {
		feed,
		local,
		playback,
	},
})
