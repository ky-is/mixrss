<template>
<li class="feed-item hover-outer">
	<div @click="onItem(index)" class="item-icon" :style="{ 'background-image': `url(${item.image})` }" />
	<div>
		<div class="title">
			<div>{{ item.title }}</div>
			<button @click="onTitle" class="button-modify button-outline text-small text-faint hover-inner">Edit</button>
		</div>
		<div class="text-small text-faint hover-inner">
			<div>
				<span>{{ item._duration || item.summary }}</span>
				・
				<time :datetime="date">{{ date.toLocaleDateString() }}</time>
				・
				<span v-if="item.author">{{ item.author.name }} ・</span>
				<span class="tags">
					<span v-if="tags">
						<button v-for="tag in tags" @click="onTag(tag)" class="button-modify button-tag hide-parent" :key="tag">{{ tag }}<span class="tag-delete hide-child">✖︎</span></button>
					</span>
					<button @click="onTagAdd" class="button-modify button-outline">+Tag</button>
				</span>
			</div>
			<div class="description-container">
				<span v-if="item.content_text" class="description" :title="item.content_text">{{ item.content_text }}&nbsp;</span>
				<button @click="onNoteEdit" class="button-modify button-outline">{{ item.content_text ? 'Edit' : '+Note' }}</button>
			</div>
		</div>
	</div>
</li>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		index: Number,
		item: Object as () => JSONFeedItem, //TODO https://github.com/vuejs/vue/pull/6856
	},

	computed: {
		date (): Date {
			return new Date(this.item.date_published)
		},

		tags (): string[] | null {
			// return [ 'Post-Rock' ]
			const tags = this.item.tags
			return tags && tags.length ? tags : null
		},
	},

	methods: {
		onItem (index: number) {
			this.$store.commit('SET_INDEX', index)
		},

		onTitle () {
			const title = window.prompt('Please enter a title for this song:', this.item.title)
			if (title) {
				this.$store.commit('SONG_TITLE', { item: this.item, title })
			}
		},

		onTag (tag: string) {
			this.$store.commit('SONG_TAG', { item: this.item, tag, add: false })
		},

		onTagAdd () {
			const tag = window.prompt('Please enter a tag this song belongs to:')
			if (tag) {
				this.$store.commit('SONG_TAG', { item: this.item, tag, add: true })
			}
		},

		onNoteEdit () {
			const description = window.prompt('Enter a description to show to listeners of this song:', this.item.content_text)
			if (description !== null) {
				this.$store.commit('SONG_DESCRIPTION', { item: this.item, description })
			}
		},
	},
})
</script>

<style scoped>
.feed-item {
	display: flex;
	align-items: center;
	padding: 8px;
	transition: background-color 200ms;
	border-radius: 2px;
}

.feed-item:hover {
	background-color: #eee;
}
.feed-item:hover:active {
	background-color: #ddd;
}

.feed-item.selected {
	background: #ffeef8 !important;
}

.item-icon {
	width: 64px;
	height: 64px;
	border-radius: 3px;
	background-size: cover;
	margin-right: 8px;
	flex-shrink: 0;
	transition: box-shadow 500ms;
}

.title {
	display: flex;
	align-items: baseline;
}
.title button {
	margin-left: 4px;
}

.item-icon:hover {
	cursor: pointer;
}

.selected .item-icon {
	box-shadow: 0 1px 2px #333;
}

.button-modify {
	border-radius: 6px;
	padding: 0 4px;
	padding-bottom: 1px;
	margin-right: 4px;
	border-color: transparent;
}

button.button-outline, .button-tag:hover {
	border-color: #777;
}
.button-modify:hover {
	background: #fff;
}

.tag-delete {
	line-height: 0;
	margin-left: 2px;
	font-size: 14px;
}

.description-container {
	display: flex;
}
.description {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
