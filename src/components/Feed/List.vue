<template>
<ul class="feed-list">
	<FeedItem v-for="item in items" :item="item" :key="item.id" :class="{ selected: playId === item.id }" />
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

		playId (): string | null {
			return this.$store.state.playback.id
		},
	},
})
</script>
