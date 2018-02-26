<template>
<div id="app">
	<add-feed />
</div>
</template>

<script>
import AddFeed from '@/components/AddFeed'
export default {
	components: {
		AddFeed,
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
