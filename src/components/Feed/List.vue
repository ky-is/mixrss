<template>
<ul>
	<FeedItem
		v-for="item in items" :key="item.id"
		:item="item" :class="{ selected: playId === item.id }"
	/>
</ul>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import FeedItem from '@/components/Feed/Item.vue'

import { JSONFeedItem } from '@/types/jsonfeed'

export default Vue.extend({
	components: {
		FeedItem,
	},

	computed: {
		items (): JSONFeedItem[] {
			return store.getters.songs
		},

		playId (): string | null {
			return store.state.playback.id
		},
	},
})
</script>
