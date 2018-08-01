<template>
<div id="app">
	<LoadFeed />
	<FeedAdd />
	<FeedList v-if="currentFeedData" :items="currentFeedData.items" />
</div>
</template>

<script>
import FeedAdd from '@/components/Feed/Add'
import LoadFeed from '@/components/Feed/Load'
import FeedList from '@/components/Feed/List'

export default {
	components: {
		FeedAdd,
		FeedList,
		LoadFeed,
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

	margin: auto;
	max-width: 600px;
	padding: 8px;
	box-sizing: border-box;
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
	padding: 0 12px;
}

input {
	padding: 0 4px;
}
</style>
