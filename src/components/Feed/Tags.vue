<template>
<ul class="tag-list">
	<li v-for="tag in tags" :key="tag">
		<button @click="onTag(tag)" :class="{ selected: selected.indexOf(tag.toLowerCase()) !== -1 }">{{ tag }}</button>
	</li>
</ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		items: Array as () => JSONFeedItem[], //TODO https://github.com/vuejs/vue/pull/6856
		selected: Array as () => string[],
	},

	model: {
		prop: 'selected',
	},

	computed: {
		tags (): string[] {
			const tagHash = new Map<string, string>()
			for (const item of this.items) {
				if (!item.tags) {
					continue
				}
				for (const tag of item.tags) {
					const id = tag.toLowerCase()
					if (!tagHash.has(id)) {
						tagHash.set(id, tag)
					}
				}
			}
			return Array.from(tagHash.values())
		},
	},

	methods: {
		onTag (tag: string) {
			const tagId = tag.toLowerCase()
			const selectedTags = this.selected.slice()
			const tagIndex = selectedTags.indexOf(tagId)
			if (tagIndex === -1) {
				selectedTags.push(tagId)
			} else {
				selectedTags.splice(tagIndex, 1)
			}
			this.$emit('input', selectedTags)
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
}
</style>
