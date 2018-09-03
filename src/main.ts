import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import querystring from 'querystring'

import App from './App.vue'

import store from '@/store'

import Plugins from '@/helpers/plugins'

Vue.config.productionTip = false

Vue.use(VueYoutube)
Vue.use(Plugins)

new Vue({
	render: h => h(App),
	store,
}).$mount('#app')

const queryString = window.location.search
if (queryString) {
	const queryObject = querystring.parse(queryString.substring(1))
	const feeds = queryObject.feeds as string | undefined
	if (feeds) {
		feeds.split(',')
			.forEach(url => store.dispatch('LOAD_FEED_URL', { url, adding: true }))
	}
	const play = queryObject.play as string | undefined
	if (play) {
		Vue.nextTick(() => {
			store.dispatch('QUEUE_PLAY_URL', play)
		})
	}
	window.history.replaceState(null, undefined, window.location.pathname)
}
