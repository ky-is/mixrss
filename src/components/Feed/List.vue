<template>
<ul class="feed-list">
	<FeedItem v-for="(item, index) in renderItems" :item="item" :index="index" :key="item.id" :class="{ selected: index === playIndex }" />
</ul>
</template>

<script lang="ts">
import Vue from 'vue'

import FeedItem from '@/components/Feed/Item.vue'

export default Vue.extend({
	components: {
		FeedItem,
	},

	props: {
		items: Array as () => JSONFeedItem[], //TODO https://github.com/vuejs/vue/pull/6856
		tags: Array as () => string[],
	},

	computed: {
		renderItems (): JSONFeedItem[] {
			const filterTags = this.tags
			if (!filterTags.length) {
				return this.items
			}
			return this.items.filter(item => {
				const itemTags = item.tags
				if (itemTags) {
					const itemTagIds = itemTags.map(tag => tag.toLowerCase())
					for (const filterTag of filterTags) {
						if (itemTagIds.indexOf(filterTag) !== -1) {
							return true
						}
					}
				}
				return false
			})
		},

		playIndex (): number | null {
			return this.$store.state.playback.index
		},
	},
})
</script>

<style scoped>
</style>
