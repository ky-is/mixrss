<template>
<div id="app">
	<HomeView />
	<PlayBar />
	<PlayManager />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeView from '@/views/Home.vue'

import PlayBar from '@/components/Play/Bar.vue'
import PlayManager from '@/components/Play/Manager.vue'

import TheSidebar from '@/components/Sidebar'

export default Vue.extend({
	components: {
		HomeView,
		PlayBar,
		PlayManager,
		TheSidebar,
	},
})
</script>

<style>
html {
	width: 100%;
	height: 100%;
}

body, #app {
	width: inherit;
	height: inherit;
}

body {
	margin: 0;
}

#app {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: 18px;

	display: flex;
	flex-direction: column;
}

::selection {
	background: #fde;
}

.view-home {
	flex-grow: 100;
}

.play-bar {
	flex-shrink: 0;
	height: 64px;
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
