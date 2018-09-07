declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}

declare module 'fetch-jsonp'

declare module 'soundcloud'

declare module 'vue-youtube'

declare module 'vue/types/vue' {
	interface Vue {
		$youtube: any
	}
}
