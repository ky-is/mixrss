<template>
<li class="feed-item hover-outer p-2 flex">
	<button @click="onItem" class="item-icon borderless mr-2" :class="{ youtube: item._imageAlign === 'youtube' }" :style="{ 'background-image': `url(${item.image})` }" />
	<div class="song-details">
		<div class="title">
			<div v-if="editTitle" class="flex">
				<input type="text" v-model.trim="itemTitle" class="flex-grow mr-1" placeholder="Playlist title" autocomplete="off" autocorrect="on">
				<button @click="onTitleSave" class="button-modify button-outline">{{ itemTitle === item.title ? 'Cancel' : 'Save' }}</button>
			</div>
			<div v-else>
				<button @click="onTitleToggle" class="unstyled text-left">{{ item.title }}</button>
			</div>
		</div>
		<div class="text-sm text-faint hover-inner">
			<div>
				<span>{{ item._duration || item.summary }}</span>
				<span> ・ </span>
				<time :datetime="date">{{ date.toLocaleDateString() }}</time>
				<span> ・</span>
				<span v-if="item.author"> {{ item.author.name }} ・</span>
				<span class="tags">
					<span v-if="tags">
						<button v-for="tag in tags" @click="onTag(tag)" class="button-modify button-tag hover-parent" :key="tag">{{ tag }}<span class="tag-delete hover-child ml-px">✖︎</span></button>
					</span>
					<button @click="onTagAdd" class="button-modify button-outline">+Tag</button>
				</span>
			</div>
			<div class="flex">
				<button v-if="item.content_text" @click="onNoteEdit" class="description unstyled">{{ item.content_text }}</button>
				<button v-else @click="onNoteEdit" class="button-modify button-outline">{{ item.content_text ? 'Edit' : '+Note' }}</button>
			</div>
		</div>
	</div>
	<div class="hover-inner">
		<button @click="onDelete" class="button-delete unstyled">✕</button>
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
		id (): string {
			return this.item.id
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
			this.$store.commit('SET_PLAYBACK_ID', this.id)
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

		onDelete () {
			const confirmed = window.confirm(`Delete ${this.item.title} from this playlist?`)
			if (confirmed) {
				this.$store.dispatch('REMOVE_FEED_ITEM', this.item.id)
			}
		},
	},
})
</script>

<style scoped>
.feed-item {
	align-items: center;
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

/* ALBUM ART */

.item-icon {
	width: 64px;
	height: 64px;
	border-radius: 3px;
	background-size: cover;
	background-position: center;
	flex-shrink: 0;
	transition: box-shadow 500ms;
}
.item-icon.youtube {
	background-size: 262%;
	background-position: -9.5px -9.5px;
}

/* SONG DETAILS */

.song-details {
	flex-grow: 1;
}
.selected .song-details .hover-inner {
	visibility: visible;
}

.title {
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

.tag-delete {
	line-height: 0;
	font-size: 12px;
}

.description {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* MANAGE */

.button-delete {
	width: 48px;
	height: 48px;
	color: #f33;
	font-weight: 900;
}
</style>
