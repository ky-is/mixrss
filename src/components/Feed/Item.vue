<template>
<li class="feed-item outer-group animate">
	<button class="borderless wh-16 flex-no-shrink mr-2" @click="onPlay">
		<AlbumArt :url="item.image" :align="item._imageAlign" />
	</button>
	<div class="song-details flex-grow">
		<div class="items-baseline mb-px">
			<form v-if="editTitle" class="flex" @submit.prevent="onTitleSave">
				<input v-focus v-model.trim="itemTitle" type="text" class="flex-grow mr-1" placeholder="Mix title" autocomplete="off" autocorrect="on">
				<button type="submit" class="button-modify">{{ itemTitle === item.title ? 'Cancel' : 'Save' }}</button>
			</form>
			<div v-else>
				<button class="unstyled text-left" @click="onTitleToggle">{{ item.title }}</button>
			</div>
		</div>
		<div class="text-sm text-grey-darker inner-hover inner-selected">
			<div>
				<span>{{ item._duration || item.summary }}</span>
				<span> ・ </span>
				<time :datetime="date">{{ date.toLocaleDateString() }}</time>
				<span> ・</span>
				<span v-if="item.author"> {{ item.author.name }} ・</span>
				<span>
					<template v-if="tags">
						<button v-for="tag in tags" :key="tag" class="button-tag group" @click="onTag(tag)">
							{{ tag }}<span class="px-px leading-none text-xs invisible group-hover:visible">✖︎</span>
						</button>
					</template>
					<button class="button-modify" @click="onTagAdd">+Tag</button>
				</span>
			</div>
			<div class="flex">
				<button v-if="item.content_text" class="unstyled truncate" @click="onNoteEdit">{{ item.content_text }}</button>
				<button v-else class="button-modify" @click="onNoteEdit">{{ item.content_text ? 'Edit' : '+Note' }}</button>
			</div>
		</div>
	</div>
	<div class="inner-hover">
		<button class="button-delete unstyled wh-12 font-black text-danger" @click="onDelete">✕</button>
	</div>
</li>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeedItem } from '@/types/jsonfeed'

import AlbumArt from '@/components/Feed/AlbumArt.vue'

export default Vue.extend({
	components: {
		AlbumArt,
	},

	props: {
		item: {
			type: Object as () => JSONFeedItem,
			required: true,
		},
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
		onPlay () {
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
	@apply p-2 rounded-sm  flex items-center;
	&:not(.selected):hover {
		@apply bg-grey-lightest;
		&:active {
			@apply bg-grey-light;
		}
	}
	&.selected {
		@apply bg-brand-lightest;
	}
}

/* SONG DETAILS */

.button-modify, .button-tag {
	@apply mr-1 pb-px;
	&:hover {
		@apply bg-white;
	}
}
.button-modify {
	@apply px-1 rounded;
}
.button-tag {
	@apply pl-1 pr-px rounded-full border-transparent;
}

.button-modify, .button-tag:hover {
	@apply border-grey-dark;
}
</style>
