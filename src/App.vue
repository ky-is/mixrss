<template>
<div id="app">
	<AddFeed />
	<FeedList v-if="currentFeedData" :items="currentFeedData.items" />
</div>
</template>

<script>
import AddFeed from '@/components/Feed/Add'
import FeedList from '@/components/Feed/List'

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
