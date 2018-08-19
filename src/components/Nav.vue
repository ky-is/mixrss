<template>
<nav class="h-12 sm:hidden  flex items-stretch justify-between">
	<button @click="onToggleSidebar" class="side-item borderless text-xl">♬</button>
	<div class="m-auto">{{ title }}</div>
	<div class="side-item"><!--  --></div>
</nav>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeed } from '@/types/jsonfeed'
import { FeedState } from '@/types/store'

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
