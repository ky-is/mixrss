<template>
<form @submit.prevent="onSubmit" :disabled="loading" class="my-2">
	<div v-if="showEdit">
		<div class="halves">
			<input type="text" v-model.trim="feedTitle" placeholder="Mix title" autocomplete="off" autocorrect="on">
			<input type="text" v-model.trim="feedAuthor" placeholder="Your name" autocomplete="off" autocorrect="off">
			<input type="url" v-model.trim="feedIcon" placeholder="Icon URL (optional)" autocomplete="off" autocorrect="off">
			<input type="url" v-model.trim="feedUrl" placeholder="URL where you'll host this feed." autocomplete="off" autocorrect="off">
		</div>
		<div class="line">
			<button type="submit">Save</button>
			<button @click.prevent="onToggleEdit">Cancel</button>
			<button @click.prevent="onDelete">Delete</button>
		</div>
	</div>
	<div v-else-if="!showForm" class="line">
		<button @click.prevent="onToggleForm">Add new entry...</button>
		<button @click.prevent="onToggleEdit">Edit metadata</button>
		<button v-if="songs.length" @click.prevent="onExportFeed" class="w-4">
			<svg class="w-4 h-4" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
		</button>
		<a ref="downloadLink" class="hidden" :download="fileName" />
	</div>
	<div v-else-if="feedData" class="line">
		<input type="url" v-model.trim="itemUrl" class="flex-grow-all" placeholder="YouTube/SoundCloud URL" autocomplete="off" autocorrect="off">
		<button type="submit" class="flex-no-grow">{{ itemUrl ? 'Load' : 'Cancel' }}</button>
	</div>
</form>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { PLACEHOLDER_FEED_URL } from '@/helpers/constants'

import { JSONFeed, JSONFeedItem } from '@/types/jsonfeed'
import { FeedState } from '@/types/store'

export default Vue.extend({
	data () {
		return {
			loading: false,
			showForm: false,
			showEdit: false,

			feedUrl: '',
			itemUrl: null as string | null,

			feedTitle: null as string | null,
			feedAuthor: null as string | null,
			feedIcon: null as string | null,
		}
	},

	computed: {
		isLocal (): boolean {
			return this.feed.url === null
		},

		feed (): FeedState {
			return store.state.feed
		},

		songs (): JSONFeedItem[] {
			return store.getters.songs
		},

		feedData (): JSONFeed {
			return this.feed.data!
		},

		currentFeedAuthor (): string | null {
			const author = this.feedData.author
			return (author && author.name) || null
		},

		currentFeedUrl (): string | null {
			return (this.feedData && this.feedData.feed_url) || null
		},

		currentFeedIcon (): string | null {
			return (this.feedData && this.feedData.icon) || null
		},

		fileName (): string {
			if (this.currentFeedUrl) {
				const split = this.currentFeedUrl.split('/')
				if (split.length > 1) {
					return split[split.length - 1]
				}
			}
			return 'feed.json'
		},

		localAuthor (): string | null {
			return store.state.local.author
		},

		currentTitle (): string | null {
			return (this.feedData && this.feedData.title) || null
		},
	},

	watch: {
		isLocal: {
			immediate: true,
			handler (isLocal) {
				if (isLocal) {
					this.feedAuthor = this.currentFeedAuthor || this.localAuthor
				}
			},
		},

		currentFeedAuthor (currentFeedAuthor) {
			this.feedAuthor = currentFeedAuthor
		},

		currentTitle: {
			immediate: true,
			handler (currentTitle) {
				this.feedTitle = currentTitle
				this.showEdit = !currentTitle || !this.currentFeedAuthor
			},
		},

		currentFeedUrl: {
			immediate: true,
			handler (currentFeedUrl) {
				this.feedUrl = currentFeedUrl !== PLACEHOLDER_FEED_URL ? currentFeedUrl : null
			},
		},

		currentFeedIcon: {
			immediate: true,
			handler (currentFeedIcon) {
				this.feedIcon = currentFeedIcon
			},
		},
	},

	created () {
		const feedAuthor = this.feedData.author
		if (!feedAuthor || !feedAuthor.name || !this.feedData.title) {
			this.showEdit = true
		}
	},

	methods: {
		onToggleForm () {
			this.showForm = !this.showForm
		},

		onToggleEdit () {
			this.showEdit = !this.showEdit
		},

		onExportFeed () {
			const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.feedData, null, '	'))}`
			const el = this.$refs.downloadLink as HTMLElement
			el.setAttribute('href', data)
			el.click()
		},

		onSubmit () {
			if (this.showEdit) {
				if (!this.feedTitle) {
					this.feedTitle = this.currentTitle
				}
				const author = this.feedAuthor
				if (author) {
					store.commit('SET_AUTHOR', author)
				}
				store.commit('UPDATE_FEED', { author, title: this.feedTitle || '', url: this.feedUrl, icon: this.feedIcon })
				this.onToggleEdit()
			} else {
				const submitUrl = this.itemUrl
				if (submitUrl) {
					this.loading = true
					store.dispatch('ADD_FEED_ITEM', submitUrl)
						.then(() => {
							if (submitUrl === this.itemUrl) {
								this.itemUrl = null
								this.onToggleForm()
							}
						})
						.catch(error => {
							console.log('ADD_FEED_ITEM', error)
						})
						.finally(() => {
							this.loading = false
						})
				} else {
					this.onToggleForm()
				}
			}
		},

		onDelete () {
			const confirmed = window.confirm(`Are you sure you want to remove this playlist ${this.isLocal ? 'permanently' : 'locally'}?`)
			if (confirmed) {
				store.dispatch('DELETE_FEED', this.feed.url)
			}
		},
	},
})
</script>

<style lang="postcss" scoped>
input, button {
	@apply h-10 px-2;
	min-width: 64px;
}

.halves {
	& input, & button {
		@apply w-1/2;
	}
}

.line {
	@apply flex;
	& input, & button {
		@apply flex-grow;
	}
}
</style>
