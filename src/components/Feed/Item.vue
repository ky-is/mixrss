<template>
<li class="feed-item hover-outer animate">
	<button @click="onItem" class="item-icon bg-image borderless animate" :class="{ youtube: item._imageAlign === 'youtube' }" :style="{ 'background-image': `url(${item.image})` }" />
	<div class="song-details flex-grow">
		<div class="items-baseline">
			<div v-if="editTitle" class="flex">
				<input type="text" v-model.trim="itemTitle" class="flex-grow mr-1" placeholder="Mix title" autocomplete="off" autocorrect="on">
				<button @click="onTitleSave" class="button-modify button-outline">{{ itemTitle === item.title ? 'Cancel' : 'Save' }}</button>
			</div>
			<div v-else>
				<button @click="onTitleToggle" class="unstyled text-left">{{ item.title }}</button>
			</div>
		</div>
		<div class="text-sm text-grey-darker hover-inner">
			<div>
				<span>{{ item._duration || item.summary }}</span>
				<span> ・ </span>
				<time :datetime="date">{{ date.toLocaleDateString() }}</time>
				<span> ・</span>
				<span v-if="item.author"> {{ item.author.name }} ・</span>
				<span class="tags">
					<span v-if="tags">
						<button v-for="tag in tags" @click="onTag(tag)" class="button-modify button-tag group" :key="tag">
							{{ tag }}<span class="ml-px pl-px leading-none text-xs group-hover:visible">✖︎</span>
						</button>
					</span>
					<button @click="onTagAdd" class="button-modify button-outline">+Tag</button>
				</span>
			</div>
			<div class="flex">
				<button v-if="item.content_text" @click="onNoteEdit" class="unstyled truncate">{{ item.content_text }}</button>
				<button v-else @click="onNoteEdit" class="button-modify button-outline">{{ item.content_text ? 'Edit' : '+Note' }}</button>
			</div>
		</div>
	</div>
	<div class="hover-inner">
		<button @click="onDelete" class="button-delete unstyled wh-12 font-black text-red">✕</button>
	</div>
</li>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeedItem } from '@/types/jsonfeed'

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
			store.commit('SET_PLAYBACK_ID', this.id)
		},

		onTitleToggle () {
			this.editTitle = !this.editTitle
			this.itemTitle = (this.editTitle && this.item.title) || ''
		},
		onTitleSave () {
			if (this.itemTitle !== this.item.title) {
				store.commit('SONG_TITLE', { item: this.item, title: this.itemTitle })
			}
			this.onTitleToggle()
		},

		onTag (tag: string) {
			store.commit('SONG_TAG', { item: this.item, tag, add: false })
		},
		onTagAdd () {
			const tag = window.prompt('Please enter a tag this song belongs to:')
			if (tag) {
				store.commit('SONG_TAG', { item: this.item, tag, add: true })
			}
		},

		onNoteEdit () {
			const description = window.prompt('Enter a description to show to listeners of this song:', this.item.content_text)
			if (description !== null) {
				store.commit('SONG_DESCRIPTION', { item: this.item, description })
			}
		},

		onDelete () {
			const feedData = store.state.feed.data
			const feedName = (feedData && feedData.title) || 'this mix'
			const confirmed = window.confirm(`Delete ${this.item.title} from ${feedName}?`)
			if (confirmed) {
				store.dispatch('REMOVE_FEED_ITEM', this.item.id)
			}
		},
	},
})
</script>

<style lang="postcss" scoped>
.feed-item {
	@apply p-2 rounded-sm flex items-center;
	&:not(.selected):hover {
		@apply bg-grey-lightest;
		&:active {
			@apply bg-grey-light;
		}
	}
	&.selected {
		@apply bg-pink-lightest;
	}
}

/* ALBUM ART */

.item-icon {
	@apply mr-2 wh-16 rounded cursor-pointer;
	box-shadow: 0 1px 3px #bbb;
	&.youtube {
		background-size: 262%;
		background-position: -9.5px -9.5px;
	}
}
.selected .item-icon {
	box-shadow: 0 1px 3px #777;
}

/* SONG DETAILS */

.selected .song-details .hover-inner {
	@apply visible;
}

.button-modify {
	@apply mr-1 px-1 pb-px rounded border-transparent;
	&:hover {
		@apply bg-white;
	}
}

button.button-outline, .button-tag:hover {
	@apply border-grey-darker;
}
</style>
