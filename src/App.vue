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

export default Vue.extend({
	components: {
		HomeView,
		PlayBar,
		PlayManager,
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

ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

/* Links */

a {
	text-decoration: none;
}
a[href] {
	color: #f24;
}
a[href]:hover {
	opacity: 0.67;
}
a[href]:hover:active {
	opacity: 0.5;
}

/* Theme colors */

::selection {
	background: #fde;
}

.theme-color {
	color: #f8a;
}

.backed, button.selected {
	background: #f8a;
}

/* Home */

.view-home {
	flex-grow: 100;
}

.play-bar {
	flex-shrink: 0;
	height: 64px;
}

/* Text */

.text-small {
	font-size: 0.8em;
}
.text-tiny {
	font-size: 0.6em;
}

.text-faint {
	/* color: #888; */
	opacity: 0.5;
}

.text-center {
	text-align: center;
}

.text-italic {
	font-style: italic;
}

.margin-auto {
	margin: auto;
}

/* Hover */

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

button.backed {
	border-radius: 5px;
	border: 0;
	height: 48px;
	min-width: 224px;
	color: #fff;
	font-weight: 600;
	font-size: 24px;
}

button.borderless, button.unstyled {
	border: 0;
}
button.unstyled {
	padding: 0;
}
</style>
