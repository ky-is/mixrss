<template>
<form @submit.prevent="onSubmit" class="my-2">
	<div v-if="showEdit">
		<div>
			<input type="text" v-model.trim="feedTitle" placeholder="Playlist title" autocomplete="off" autocorrect="on">
			<input type="text" v-model.trim="feedAuthor" placeholder="Your name" autocomplete="off" autocorrect="off">
		</div>
		<div>
			<input type="url" v-model.trim="feedIcon" placeholder="URL to playlist icon (optional)" autocomplete="off" autocorrect="off">
			<input type="url" v-model.trim="feedUrl" placeholder="URL where you'll host this feed." autocomplete="off" autocorrect="off">
		</div>
		<div>
			<button type="submit">Save</button>
			<button @click.prevent="onToggleEdit">Cancel</button>
			<button @click.prevent="onDelete">Delete</button>
		</div>
	</div>
	<div v-else-if="!showForm">
		<button @click.prevent="onToggleForm">Add new entry...</button>
		<button @click.prevent="onToggleEdit">Edit metadata</button>
		<button v-if="songs.length" @click.prevent="onExportFeed">Download</button>
		<a ref="downloadLink" style="display:none" :download="fileName" />
	</div>
	<div v-else-if="feedData" class="flex">
		<input type="url" v-model.trim="itemUrl" placeholder="YouTube/SoundCloud URL" autocomplete="off" autocorrect="off">
		<button type="submit">Load</button>
		<button @click.prevent="onToggleForm">Cancel</button>
	</div>
</form>
</template>

<script lang="ts">
import Vue from 'vue'

import { PLACEHOLDER_FEED_URL } from '@/helpers/constants'

export default Vue.extend({
	data () {
		return {
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
	
		feed (): any {
			return this.$store.state.feed
		},

		songs (): JSONFeedItem[] {
			return this.$store.getters.songs
		},

		feedData (): JSONFeed {
			return this.feed.data
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

		localAuthor (): string {
			return this.$store.state.local.author
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
					this.$store.commit('SET_AUTHOR', author)
				}
				this.$store.commit('UPDATE_FEED', { author, title: this.feedTitle || '', url: this.feedUrl, icon: this.feedIcon })
				this.onToggleEdit()
				return
			}
			if (!this.itemUrl) {
				return window.alert('Please enter a Youtube link to the song.')
			}
			this.$store.dispatch('ADD_FEED_ITEM', this.itemUrl)
		},

		onDelete () {
			this.$store.dispatch('DELETE_FEED', this.feed.url)
		},
	},
})
</script>

<style scoped>
input, button {
	height: 44px;
	padding: 0 12px;
}

.create-playlist input, .create-playlist button {
	width: 50%;
}
</style>
