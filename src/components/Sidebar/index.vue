<template>
<div class="sidebar">
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

	computed: {
		feedList (): string[] {
			return this.$store.state.feed.list
		},
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
