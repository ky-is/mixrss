<template>
<li @click="onItem" class="feed-item hover-outer">
	<div class="item-icon" :style="{ 'background-image': `url(${item.icon})` }" />
	<div>
		<div class="title">{{ item.title }}</div>
		<span class="text-faint text-small">{{ item.items ? item.items.length : 0 }} songs ・ {{ item.author.name || 'Unknown' }}</span>
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
			return storage.getJSON(this.url)
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
.feed-item {
	display: flex;
	cursor: pointer;
	align-items: center;
	padding: 6px;
	transition: background-color 250ms;
}
.feed-item:hover {
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
