<template>
<div id="app">
	<LoadFeed />
	<FeedList v-if="currentFeedData" :items="currentFeedData.items" />
</div>
</template>

<script>
import LoadFeed from '@/components/Feed/Load'
import FeedList from '@/components/Feed/List'

export default {
	components: {
		LoadFeed,
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
	font-size: 18px;
}

/* Form */

button, input {
	font-size: inherit;
	border: 1px solid #ddd;
	padding: 0;
	outline: none;
}

button {
	background-image: none;
	background-color: none;
	box-shadow: none;
	cursor: pointer;
}

input {
	padding: 0 4px;
}
</style>
