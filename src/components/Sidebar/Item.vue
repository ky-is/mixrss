<template>
<li @click="onItem" class="sidebar-item hover-outer" :class="{ selected: url === feedUrl }">
	<div class="item-icon" :style="{ 'background-image': `url(${item.icon})` }" />
	<div>
		<div class="title">{{ item.title }}</div>
		<span class="text-faint text-small">{{ item.items ? item.items.length : 0 }} songs ・ {{ item.author.name || 'Unknown' }}</span>
		<div class="text-faint text-tiny hover-inner">{{ shortUrl }}</div>
	</div>
</li>
</template>

<script lang="ts">
import Vue from 'vue'

import storage from '@/helpers/storage'

export default Vue.extend({
	props: {
		url: String,
	},

	computed: {
		item (): JSONFeedItem {
			return storage.getJSON(this.url || 'LOCAL_FEED')
		},

		feedUrl (): string | null {
			return this.$store.state.feed.url
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
			this.$store.dispatch('SEET_FEED_BY_URL', this.url)
		},
	},
})
</script>

<style scoped>
.sidebar-item {
	display: flex;
	cursor: pointer;
	align-items: center;
	padding: 6px;
	margin: 16px 0;
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
	margin-right: 4px;
	flex-shrink: 0;
}
</style>
