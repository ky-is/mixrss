<template>
<form @submit.prevent="onSubmit" class="feed-add">
	<div v-if="!showForm">
		<button @click.prevent="onToggleForm">Add new entry...</button>
		<button v-if="feedModified" @click.prevent="onExportFeed">Save feed</button>
		<a ref="downloadLink" style="display:none" download="feed.json" />
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

<script>
export default {
	data () {
		return {
			showForm: false,
			itemUrl: null,

			feedTitle: null,
			feedAuthor: null,
			feedIcon: null,
		}
	},

	computed: {
		currentFeed () {
			return this.$store.state.currentFeed
		},

		feedModified () {
			return this.currentFeed.modified
		},

		feedData () {
			return this.currentFeed.data
		},
	},

	created () {
		this.feedUrl = this.currentFeed.url
		this.feedAuthor = this.$store.state.author
	},

	methods: {
		onToggleForm () {
			this.showForm = !this.showForm
		},

		onExportFeed () {
			const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.feedData))}`
			const el = this.$refs.downloadLink
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
}
</script>

<style scoped>
.feed-add {
	margin: 8px 0;
}

.feed-add > div {
	display: flex;
	height: 44px;
}
</style>
