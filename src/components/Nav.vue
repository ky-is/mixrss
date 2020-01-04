<template>
<nav class="sm:hidden h-12 bg-gray-300 border-b  flex items-stretch justify-between">
	<button class="side-item borderless text-xl" @click="onToggleSidebar">♬</button>
	<div class="m-auto">{{ title }}</div>
	<div class="side-item"><!--  --></div>
</nav>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeed } from '@/types/jsonfeed'

export default Vue.extend({
	computed: {
		addingFeed (): boolean {
			return store.state.local.addingFeed
		},

		feedData (): JSONFeed | null {
			return store.state.feed.data
		},

		title (): string {
			return this.addingFeed ? 'Add a new feed' : (this.feedData ? this.feedData.title || 'Untitled Mix' : '?')
		},
	},

	methods: {
		onToggleSidebar () {
			store.commit('TOGGLE_SIDEBAR')
		},
	},
})
</script>

<style lang="postcss" scoped>
.side-item {
	@apply w-12;
}
</style>
