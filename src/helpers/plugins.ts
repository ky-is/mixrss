import { PluginFunction } from 'vue/types/plugin'
import { DirectiveFunction } from 'vue/types/options'

const install: PluginFunction<any> = (Vue) => {
	const inserted: DirectiveFunction = (el) => el.focus()
	Vue.directive('focus', { inserted })
}

export default install
