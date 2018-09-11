<template>
<ul class="mb-1  flex flex-wrap">
	<li v-for="tag in tags" :key="tag" class="tag">
		<button :class="{ selected: selectedTagIds.includes(tag.toLowerCase()) }" class="tag-button" @click="onTag(tag)">{{ tag }}</button>
	</li>
	<li v-show="tags.length" class="tag">
		<button :class="{ selected: selectedTagIds.includes('?') }" class="tag-button" @click="onTag('?')">？</button>
	</li>
	<button v-show="selectedTagIds.length" class="tag-button" @click="onClearTags">✕</button>
</ul>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeedItem } from '@/types/jsonfeed'

export default Vue.extend({
	props: {
		items: {
			type: Array as () => JSONFeedItem[],
			required: true,
		},
	},

	computed: {
		tags (): string[] {
			const rawTagNames = this.items.filter(item => item.tags).flatMap(item => item.tags!)
			const tagIdMap = new Map(rawTagNames.map(tag => [ tag.toLowerCase(), tag ] as [string, string]))
			const uniqueTagsSorted = Array.from(tagIdMap.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
			return uniqueTagsSorted
		},

		selectedTagIds (): string[] {
			return store.state.feed.selectedTagIds
		},
	},

	watch: {
		tags (tags: string[]) {
			const tagIds = tags.map(tag => tag.toLowerCase())
			this.selectedTagIds
				.filter(tagId => tagId !== '?' && !tagIds.includes(tagId))
				.forEach(tagId => store.commit('TOGGLE_TAG_ID', tagId))
		},
	},

	methods: {
		onTag (tag: string) {
			store.commit('TOGGLE_TAG_ID', tag.toLowerCase())
		},

		onClearTags () {
			store.commit('CLEAR_TAGS')
		},
	},
})
</script>

<style lang="postcss" scoped>
.tag {
	@apply mr-1 mb-1;
}

.tag-button {
	@apply rounded-full px-2 whitespace-no-wrap h-8 text-base;
	min-width: 32px;
}
</style>
