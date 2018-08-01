<template>
<div class="add-feed">
	<input type="text" v-model.trim="feedUrl" @keyup.enter="onEnterFeedUrl" class="" placeholder="https://some.playlist/feed.json" autocomplete="off" autocorrect="off">
	<button type="submit" @click="onEnterFeedUrl" class="">Submit</button>
</div>
</template>

<script>
export default {
	data () {
		return {
			feedUrl: null,
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
		onEnterFeedUrl () {
			this.$store.dispatch('ADD_FEED_URL', this.feedUrl)
		},
	},
}
</script>

<style scoped>

</style>
