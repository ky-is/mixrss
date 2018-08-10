<template>
<li class="feed-item hover-outer">
	<button @click="onItem" class="item-icon borderless" :style="{ 'background-image': `url(${item.image})` }" />
	<div>
		<div class="title">
			<div v-if="editTitle">
				<input type="text" v-model.trim="itemTitle" placeholder="Playlist title" autocomplete="off" autocorrect="on">
				<button @click="onTitleSave" class="button-modify button-outline">Save</button>
			</div>
			<div v-else>
				<button @click="onTitleToggle" class="unstyled">{{ item.title }}</button>
			</div>
		</div>
		<div class="text-small text-faint hover-inner">
			<div>
				<span>{{ item._duration || item.summary }}</span>
				<span> ・ </span>
				<time :datetime="date">{{ date.toLocaleDateString() }}</time>
				<span> ・</span>
				<span v-if="item.author"> {{ item.author.name }} ・</span>
				<span class="tags">
					<span v-if="tags">
						<button v-for="tag in tags" @click="onTag(tag)" class="button-modify button-tag hover-parent" :key="tag">{{ tag }}<span class="tag-delete hover-child">✖︎</span></button>
					</span>
					<button @click="onTagAdd" class="button-modify button-outline">+Tag</button>
				</span>
			</div>
			<div class="description-container">
				<button v-if="item.content_text" @click="onNoteEdit" class="description unstyled">{{ item.content_text }}</button>
				<button v-else @click="onNoteEdit" class="button-modify button-outline">{{ item.content_text ? 'Edit' : '+Note' }}</button>
			</div>
		</div>
	</div>
</li>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		item: Object as () => JSONFeedItem, //TODO https://github.com/vuejs/vue/pull/6856
	},

	data () {
		return {
			editTitle: false,
			itemTitle: '',
		}
	},

	computed: {
		url (): string {
			return this.item.url || this.item.external_url || ''
		},

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
		onItem () {
			this.$store.commit('SET_PLAYBACK_URL', this.url)
		},

		onTitleToggle () {
			this.editTitle = !this.editTitle
			this.itemTitle = (this.editTitle && this.item.title) || ''
		},
		onTitleSave () {
			if (this.itemTitle !== this.item.title) {
				this.$store.commit('SONG_TITLE', { item: this.item, title: this.itemTitle })
			}
			this.onTitleToggle()
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
	background-position: center;
	margin-right: 8px;
	flex-shrink: 0;
	transition: box-shadow 500ms;
}

.title {
	display: flex;
	align-items: baseline;
}

.item-icon {
	box-shadow: 0 1px 2px #bbb;
}
.selected .item-icon {
	box-shadow: 0 1px 2px #666;
}
.item-icon:hover {
	cursor: pointer;
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

.button-tag {
	margin: 0;
}

.tag-delete {
	line-height: 0;
	margin-left: 1px;
	font-size: 12px;
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
