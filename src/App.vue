<template>
<div id="app">
	<add-feed />
	<feed-list v-if="currentFeedData" :items="currentFeedData.items" />
</div>
</template>

<script>
import AddFeed from '@/components/AddFeed'
import FeedList from '@/components/FeedList'

export default {
	components: {
		AddFeed,
		FeedList,
	},

	computed: {
		currentFeedData () {
			return this.$store.state.currentFeed.data
		},
	},
}
</script>

<style>
body {
	margin: 0;
}

#app {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
