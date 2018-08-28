import { PluginFunction } from 'vue/types/plugin'

const install: PluginFunction<any> = (Vue) => {
	Vue.directive('focus', {
		inserted: (el: HTMLElement) => el.focus(),
	})
}

export default install
