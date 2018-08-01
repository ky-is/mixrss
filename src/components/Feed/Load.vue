<template>
<div class="load-feed">
	<input class="feed-input" type="text" v-model.trim="feedUrl" @keyup.enter="onEnterFeedUrl" placeholder="https://some.playlist/feed.json" autocomplete="off" autocorrect="off">
	<button class="feed-submit" type="submit" @click="onEnterFeedUrl">Load</button>
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
.load-feed {
	display: flex;
	height: 44px;
}

input {
	flex-grow: 9;
}

button {
	flex-grow: 1;
	min-width: 64px;
}
</style>
