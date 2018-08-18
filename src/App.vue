<template>
<div id="app" class="flex flex-col">
	<HomeView />
	<PlayBar />
	<PlayManager />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeView from '@/views/Home.vue'

import PlayBar from '@/components/Play/Bar.vue'
import PlayManager from '@/components/Play/Manager/index.vue'

export default Vue.extend({
	components: {
		HomeView,
		PlayBar,
		PlayManager,
	},

	beforeCreate () {
		this.$set(this, '$store', undefined)
	},
})
</script>

<style lang="postcss">
@import 'assets/styles/tailwind.postcss';

html {
	@apply wh-full;
}

body, #app {
	width: inherit;
	height: inherit;
}

#app {
	@apply antialiased text-lg font-sans;
}

ul {
	@apply list-reset;
}

/* Links */

a {
	@apply no-underline;
	transition: 250ms color;
}
a[href] {
	@apply text-pink-dark;
}
a[href]:hover {
	@apply text-pink-darker;
}
a[href]:hover:active {
	@apply text-pink-darkest;
}

/* Theme colors */

::selection {
	@apply bg-pink-lighter;
}

.theme-color {
	@apply text-pink-light;
}

.backed, button.selected {
	@apply bg-pink-light;
}

.text-faint {
	/* color: #888; */
	opacity: 0.5;
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
	outline: none !important;
	color: inherit;
}

button {
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
</style>
