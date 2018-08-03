<template>
<div class="sidebar">
	<SidebarItem :url="null" />
	<SidebarItem v-for="feedUrl in feedList" :url="feedUrl" :key="feedUrl" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import SidebarItem from '@/components/Sidebar/Item.vue'

export default Vue.extend({
	components: {
		SidebarItem,
	},

	props: {
		feedList: Array as () => string[], //TODO https://github.com/vuejs/vue/pull/6856
	},
})
</script>

<style scoped>
.sidebar {
	width: 100%;
	box-sizing: border-box;
	overflow: hidden scroll;
}
</style>
