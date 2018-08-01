import Vue from 'vue'
import VueYoutube from 'vue-youtube'

import App from '@/App.vue'

import store from '@/store'

Vue.config.productionTip = false

Vue.use(VueYoutube)

new Vue({
	render: h => h(App),
	store,
}).$mount('#app')
