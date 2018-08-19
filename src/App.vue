<template>
<div id="app" class="antialiased text-lg font-sans  flex flex-col">
	<NavBar />
	<HomeView />
	<PlayBar />
	<PlayManager />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeView from '@/views/Home.vue'

import NavBar from '@/components/Nav.vue'
import PlayBar from '@/components/Play/Bar.vue'
import PlayManager from '@/components/Play/Manager/index.vue'

export default Vue.extend({
	components: {
		HomeView,
		NavBar,
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

html, body, #app {
	@apply wh-full;
}

ul {
	@apply list-reset;
}

/* Links */

a {
	@apply no-underline;
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

.backed, button.selected {
	@apply bg-pink-light;
}

/* Hover */

.hover-outer .hover-inner {
	@apply invisible;
}
.hover-outer:hover .hover-inner, .selected .hover-inner {
	@apply visible;
}

/* Form */

button, input {
	@apply border border-grey-light;
	outline: none !important;
	color: inherit;
}

button[disabled] {
	@apply opacity-50 cursor-default;
}

input {
	@apply px-2;
}

button.backed {
	@apply border-none rounded-lg h-12 text-white font-semibold text-2xl;
	min-width: 224px;
}

button.borderless, button.unstyled {
	@apply border-none;
}
</style>
