import Vue from 'vue'
import VueYoutube from 'vue-youtube'

import App from './App.vue'

import store from '@/store'

Vue.config.productionTip = false

Vue.use(VueYoutube)

new Vue({
	render: h => h(App),
	store,
}).$mount('#app')

const query = window.location.search
if (query) {
	const split = query.split('feeds=')
	const feedUrls = split[split.length - 1].split(',')
	if (feedUrls.length) {
		for (const url of feedUrls) {
			store.dispatch('LOAD_FEED_URL', { url, adding: true })
		}
	}
	window.history.replaceState(null, undefined, window.location.pathname)
}
