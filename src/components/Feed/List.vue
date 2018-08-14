<template>
<ul class="feed-list">
	<FeedItem v-for="item in items" :item="item" :key="item.id" :class="{ selected: playUrl === item.url || playUrl === item.external_url }" />
</ul>
</template>

<script lang="ts">
import Vue from 'vue'

import FeedItem from '@/components/Feed/Item.vue'

export default Vue.extend({
	components: {
		FeedItem,
	},

	computed: {
		items (): JSONFeedItem[] {
			return this.$store.getters.songs
		},

		playUrl (): string | null {
			return this.$store.state.playback.url
		},
	},
})
</script>
