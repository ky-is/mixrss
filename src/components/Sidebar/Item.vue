<template>
<li v-if="item" @click="onItem" class="sidebar-item hover-outer my-4 p-2 flex" :class="{ selected }">
	<div class="item-icon mr-1" :style="{ 'background-image': `url(${item.icon})` }" />
	<div>
		<div v-if="item.title" class="title">{{ item.title }}</div>
		<div v-else class="title italic">Untitled playlist</div>
		<div class="text-faint text-sm">{{ item.items ? item.items.length : 0 }} songs ・ {{ item.author.name || 'Unknown' }}</div>
		<a :href="selected ? url : null" target="_blank" class="text-faint text-xs hover-inner" rel="noopener">{{ shortUrl }}</a>
	</div>
</li>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

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
			store.dispatch('SET_FEED_BY_URL', this.url)
		},
	},
})
</script>

<style scoped>
.sidebar-item {
	cursor: pointer;
	align-items: center;
	transition: background-color 250ms;
}
.sidebar-item:hover {
	background-color: #fff1f5;
}
.sidebar-item.selected {
	cursor: default;
	background-color: #fff;
}

.item-icon {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
	flex-shrink: 0;
}

.selected .hover-inner {
	visibility: visible;
}
</style>
