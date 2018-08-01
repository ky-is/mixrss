<template>
<div id="app">
	<LoadFeed />
	<FeedAdd />
	<FeedList v-if="currentFeedData" :items="currentFeedData.items" />
	<PlayBar />
	<PlayManager />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import FeedAdd from '@/components/Feed/Add.vue'
import LoadFeed from '@/components/Feed/Load.vue'
import FeedList from '@/components/Feed/List.vue'

import PlayBar from '@/components/Play/Bar.vue'
import PlayManager from '@/components/Play/Manager.vue'

export default Vue.extend({
	components: {
		FeedAdd,
		FeedList,
		LoadFeed,
		PlayBar,
		PlayManager,
	},

	computed: {
		currentFeedData (): JSONFeed {
			return this.$store.state.currentFeed.data
		},
	},
})
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
	margin-bottom: 80px;
	max-width: 600px;
	padding: 8px;
	box-sizing: border-box;
}

::selection {
	background: #fde;
}

/* Text */

.text-small {
	font-size: 15px;
}

.text-faint {
	/* color: #888; */
	opacity: 0.5;
}

.hover-inner, .hover-child {
	visibility: hidden;
}
.hover-outer:hover .hover-inner, .hover-parent:hover .hover-child {
	visibility: visible;
}

/* Form */

button, input {
	font-size: inherit;
	border: 1px solid #ddd;
	padding: 0;
	outline: none;
	box-sizing: border-box;
	color: inherit;
}

button {
	background: none;
	box-shadow: none;
	cursor: pointer;
	padding: 0 12px;
	transition: border-color, background-color 200ms;
}
button[disabled] {
	opacity: 0.5;
	cursor: default;
}

input {
	padding: 0 4px;
}
</style>
