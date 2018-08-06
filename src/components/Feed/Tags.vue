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
			return Array.from(tagMap.values())
		},
	},

	methods: {
		onTag (tag: string) {
			const tagId = tag.toLowerCase()
			const selectedTagIds = this.selected.slice()
			const tagIndex = selectedTagIds.indexOf(tagId)
			if (tagIndex === -1) {
				selectedTagIds.push(tagId)
			} else {
				selectedTagIds.splice(tagIndex, 1)
			}
			this.$emit('input', selectedTagIds)
		},
	},

	watch: {
		tags (tags: string[]) {
			let modified = false
			const tagIds = tags.map(tag => tag.toLowerCase())
			const selectedTagIds = this.selected.slice()
			for (let idx = selectedTagIds.length; idx >= 0; idx -= 1) {
				if (tagIds.indexOf(selectedTagIds[idx]) === -1) {
					selectedTagIds.splice(idx, 1)
					modified = true
				}
			}
			if (modified) {
				this.$emit('input', selectedTagIds)
			}
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
