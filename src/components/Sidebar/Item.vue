<template>
<li v-if="item" @click="onItem" class="sidebar-item hover-outer animate" :class="{ selected }">
	<div class="bg-image wh-8 mr-1 rounded-full" :style="{ 'background-image': `url(${item.icon})` }" />
	<div>
		<div v-if="item.title" class="title">{{ item.title }}</div>
		<div v-else class="title italic">Untitled Mix</div>
		<div class="text-grey-darker text-sm">{{ item.items ? item.items.length : 0 }} songs ・ {{ item.author.name || 'Unknown' }}</div>
		<a :href="selected ? url : null" target="_blank" class="text-grey-darker text-xs hover-inner" rel="noopener">{{ shortUrl }}</a>
	</div>
</li>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeedItem } from '@/types/jsonfeed'

export default Vue.extend({
	props: {
		url: String,
		selected: Boolean,
	},

	computed: {
		item (): JSONFeedItem {
			return this.selected ? store.state.feed.data : store.getters.feedForUrl(this.url)
		},

		shortUrl (): string {
			let result = this.url
			if (!result) {
				return 'Local feed'
			}
			let split = result.split('://')
			if (split.length > 1) {
				result = split[1]
			}
			split = result.split('.')
			if (split.length > 1 && split[0].includes('www')) {
				split.shift()
				result = split.join('.')
			}
			if (result.endsWith('.json')) {
				result = result.slice(0, -5)
			}
			if (result.endsWith('.feed')) {
				result = result.slice(0, -5)
			}
			if (result.endsWith('/')) {
				result = result.slice(0, -1)
			}
			return result
		},
	},

	methods: {
		onItem () {
			store.commit('TOGGLE_SIDEBAR', false)
			store.dispatch('SET_FEED_BY_URL', this.url)
		},
	},
})
</script>

<style lang="postcss" scoped>
.sidebar-item {
	@apply my-4 p-2 cursor-pointer flex items-center;
	&:hover {
		@apply bg-pink-lightest;
	}
	&.selected {
		@apply bg-white cursor-default;
	}
}
</style>
