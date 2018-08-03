<template>
<form @submit.prevent="onSubmit" class="feed-add">
	<div v-if="showEdit">
		<input type="text" v-model.trim="feedTitle" placeholder="Playlist title" autocomplete="off" autocorrect="on">
		<input type="url" v-model.trim="feedUrl" placeholder="The URL where you'll host this feed." autocomplete="off" autocorrect="off">
		<button @click.prevent="onSaveEdit">Save</button>
		<button @click.prevent="onToggleEdit">Cancel</button>
	</div>
	<div v-else-if="!showForm">
		<button @click.prevent="onToggleForm">Add new entry...</button>
		<button @click.prevent="onToggleEdit">Edit metadata</button>
		<button v-if="songs.length" @click.prevent="onExportFeed">Save feed</button>
		<a ref="downloadLink" style="display:none" :download="fileName" />
	</div>
	<div v-else-if="feedData">
		<input type="url" v-model.trim="itemUrl" placeholder="YouTube/SoundCloud URL" autocomplete="off" autocorrect="off">
		<button type="submit">Load</button>
		<button @click.prevent="onToggleForm">Cancel</button>
	</div>
	<div v-else class="create-playlist">
		<p>Create a playlist to get started:</p>
		<div>
			<input type="text" v-model.trim="feedTitle" placeholder="Playlist title" autocomplete="off" autocorrect="on">
			<input type="text" v-model.trim="feedAuthor" placeholder="Your name" autocomplete="off" autocorrect="off">
			<input type="url" v-model.trim="feedIcon" placeholder="Url to playlist icon (optional)" autocomplete="off" autocorrect="off">
		</div>
		<div>
			<button type="submit">Create</button>
			<button @click.prevent="onToggleForm">Cancel</button>
		</div>
	</div>
</form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	data () {
		return {
			showForm: false,
			showEdit: false,

			feedUrl: '',
			itemUrl: null,

			feedTitle: '',
			feedAuthor: null,
			feedIcon: null,
		}
	},

	computed: {
		feed (): any {
			return this.$store.state.feed
		},

		songs (): JSONFeedItem[] {
			return this.$store.getters.songs
		},

		feedData (): JSONFeed {
			return this.feed.data
		},

		currentFeedUrl (): string | null {
			return (this.feedData && this.feedData.feed_url) || null
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
	},

	created () {
		this.feedAuthor = this.$store.state.local.author
		this.feedTitle = this.feedData.title
		if (this.currentFeedUrl) {
			this.feedUrl = this.currentFeedUrl
		}
	},

	methods: {
		onToggleForm () {
			this.showForm = !this.showForm
		},

		onToggleEdit () {
			this.showEdit = !this.showEdit
		},
		onSaveEdit () {
			this.$store.commit('UPDATE_FEED', { title: this.feedTitle, url: this.feedUrl })
			this.onToggleEdit()
		},

		onExportFeed () {
			const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.feedData, null, '	'))}`
			const el = this.$refs.downloadLink as HTMLElement
			el.setAttribute('href', data)
			el.click()
		},

		onSubmit () {
			if (!this.feedData) {
				if (!this.feedTitle) {
					return window.alert('Please enter a title for your playlist')
				}
				this.$store.dispatch('CREATE_FEED', { title: this.feedTitle, author: this.feedAuthor, icon: this.feedIcon })
				return
			}
			if (!this.itemUrl) {
				return window.alert('Please enter a Youtube or SoundCloud link to the song.')
			}
			this.$store.dispatch('ADD_FEED_ITEM', this.itemUrl)
		},
	},
})
</script>

<style scoped>
.feed-add {
	margin: 8px 0;
}

.flex-wrap {
	flex-wrap: wrap;
}

input, button {
	height: 44px;
}

.create-playlist input, .create-playlist button {
	width: 50%;
}
</style>
