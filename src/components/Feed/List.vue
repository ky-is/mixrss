<template>
<ul class="feed-list">
	<FeedItem v-for="(item, index) in items" :item="item" :index="index" :key="item.id" :class="{ selected: index === playIndex }" />
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

		playIndex (): number | null {
			return this.$store.state.playback.index
		},
	},
})
</script>

<style scoped>
</style>
