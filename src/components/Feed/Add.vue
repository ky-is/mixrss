<template>
<form @submit.prevent="onSubmit" class="feed-add">
	<div v-if="!showForm">
		<button @click.prevent="onToggleForm">Add new entry...</button>
		<button v-if="modified" @click.prevent="onExportFeed">Save feed</button>
		<a ref="downloadLink" style="display:none" download="feed.json" />
	</div>
	<div v-else>
		<input type="text" v-model.trim="itemUrl" placeholder="YouTube/SoundCloud URL" autocomplete="off" autocorrect="off">
		<button type="submit">Load</button>
		<button @click.prevent="onToggleForm">Cancel</button>
	</div>
</form>
</template>

<script>
export default {
	data () {
		return {
			showForm: false,
			itemUrl: null,
		}
	},

	computed: {
		currentFeed () {
			return this.$store.state.currentFeed
		},

		modified () {
			return this.currentFeed.modified
		},

		currentFeedUrl () {
			return this.currentFeed.url
		},
	},

	created () {
		this.feedUrl = this.currentFeedUrl
	},

	methods: {
		onToggleForm () {
			this.showForm = !this.showForm
		},

		onExportFeed () {
			const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.currentFeed.data))}`
			const el = this.$refs.downloadLink
			el.setAttribute('href', data)
			el.click()
		},

		onSubmit () {
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
