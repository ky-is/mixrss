<template>
<ul class="tag-list">
	<li v-for="tag in tags" :key="tag">
		<button @click="onTag(tag)" :class="{ selected: selectedTagIds.indexOf(tag.toLowerCase()) !== -1 }">{{ tag }}</button>		
	</li>
	<li v-if="tags.length"><button @click="onTag('?')" :class="{ selected: selectedTagIds.indexOf('?') !== -1 }">?</button></li>
	<button v-if="selectedTagIds.length" @click="onClearTags">✕</button>
</ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		items: Array as () => JSONFeedItem[], //TODO https://github.com/vuejs/vue/pull/6856
	},

	computed: {
		tags (): string[] {
			const tagMap = new Map<string, string>()
			for (const item of this.items) {
				if (!item.tags) {
					continue
				}
				for (const tag of item.tags) {
					const id = tag.toLowerCase()
					if (!tagMap.has(id)) {
						tagMap.set(id, tag)
					}
				}
			}
			const tags = Array.from(tagMap.values())
			return tags.sort(((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())))
		},

		selectedTagIds (): string[] {
			return this.$store.state.feed.selectedTagIds
		},
	},

	watch: {
		tags (tags: string[]) {
			const tagIds = tags.map(tag => tag.toLowerCase())
			for (const selectedTagId of this.selectedTagIds) {
				if (selectedTagId !== '?' && tagIds.indexOf(selectedTagId) === -1) {
					this.$store.commit('TOGGLE_TAG_ID', selectedTagId)
				}
			}
		},
	},

	methods: {
		onTag (tag: string) {
			this.$store.commit('TOGGLE_TAG_ID', tag.toLowerCase())
		},

		onClearTags () {
			this.$store.commit('CLEAR_TAGS')
		},
	},
})
</script>

<style scoped>
li {
	display: inline-block;
	margin-right: 4px;
}

button {
	padding: 1px 5px;
	border-radius: 5px;
	min-width: 28px;
}
</style>
