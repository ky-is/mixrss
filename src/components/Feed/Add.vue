<template>
<form @submit.prevent="onSubmit" class="feed-add">
	<div v-if="!showForm">
		<button class="add-start" @click.prevent="onToggleForm">Add new entry...</button>
	</div>
	<div v-else>
		<input type="text" v-model.trim="itemUrl" placeholder="YouTube/SoundCloud URL" autocomplete="off" autocorrect="off">
		<button type="submit">Load</button>
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
		currentFeedUrl () {
			return this.$store.state.currentFeed.url
		},
	},

	created () {
		this.feedUrl = this.currentFeedUrl
	},

	methods: {
		onToggleForm () {
			this.showForm = !this.showForm
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
