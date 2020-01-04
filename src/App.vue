<template>
<div id="app" class="antialiased text-lg font-sans text-black  flex flex-col">
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

/* Links */

a {
	@apply no-underline;
	&[href] {
		@apply text-brand-600;
		&:hover {
			@apply text-brand-800;
			&:active {
				@apply text-brand-900;
			}
		}
	}
}

/* Theme colors */

::selection {
	@apply bg-brand-300;
}

.backed, button.selected {
	@apply bg-brand-400;
}

/* Form */

button, input {
	@apply border border-gray-400;
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
