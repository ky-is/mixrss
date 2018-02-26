import Vue from 'vue'
import Vuex from 'vuex'

import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	store,
}).$mount('#app')
