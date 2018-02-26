import Vue from 'vue'
import Vuex from 'vuex'

import fetchJsonp from 'fetch-jsonp'

import storage from '@/helpers/storage'

Vue.use(Vuex)

export default new Vuex.Store({

	strict: process.env.NODE_ENV !== 'production',

	state: {
		currentFeed: {
			url: storage.get('CURRENT_FEED_URL'),
			data: storage.getJSON('CURRENT_FEED_DATA'),
		},
	},

	actions: {
		ADD_FEED_URL ({ commit }, url) {
			// const jsonpwrapper = `http://jsonpwrapper.com/?urls%5B%5D=${encodeURIComponent(url)}`
			const json2jsonp = `https://json2jsonp.com/?url=${encodeURIComponent(url)}`
			fetchJsonp(json2jsonp)
			.then(response => {
				return response.json()
			})
			.then(data => {
				commit('SET_CURRENT_FEED', { url, data })
			})
			.catch(error => {
				console.error(error)
			})
		},
	},

	mutations: {
		SET_CURRENT_FEED (state, { url, data }) {
			state.currentFeed.url = url
			state.currentFeed.data = data
			storage.set('CURRENT_FEED_URL', url)
			storage.setJSON('CURRENT_FEED_DATA', data)
			console.log(data)
		},
	},

	getters: {

	},

})
