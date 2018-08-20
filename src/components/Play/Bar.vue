<template>
<div class="h-16 bg-grey-lighter border-t  flex flex-no-shrink items-stretch justify-center">
	<button @click="onPrevious" :disabled="!hasPreviousSong">
		<svg class="seek-previous wh-9" viewBox="0 0 24 19">
			<path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</svg>
	</button>
	<button @click="onPlay" :disabled="!songs.length">
		<svg width="63" height="63" viewBox="0 0 36 36" >
			<path v-if="hasSong && !paused" d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" />
			<path v-else d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" />
		</svg>
	</button>
	<button @click="onNext" :disabled="!hasNextSong">
		<svg class="seek-next wh-9" viewBox="0 0 24 19">
			<path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</svg>
	</button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeedItem } from '@/types/jsonfeed'

export default Vue.extend({
	computed: {
		playId (): string | null {
			return store.state.playback.id
		},

		hasSong (): boolean {
			return this.playId !== null
		},

		playbackIndex (): number | null {
			return store.getters.playbackIndex
		},
		hasPreviousSong (): boolean {
			return this.playbackIndex !== null && this.playbackIndex > 0
		},
		hasNextSong (): boolean {
			return this.playbackIndex !== null && this.playbackIndex < this.songs.length - 1
		},

		songs (): JSONFeedItem[] {
			return store.getters.songs
		},

		paused (): boolean {
			return store.state.playback.paused
		},
	},

	methods: {
		onPrevious () {
			store.dispatch('SEEK_DIRECTION', -1)
		},
		onNext () {
			store.dispatch('SEEK_DIRECTION', 1)
		},

		onPlay () {
			store.dispatch('PRESS_PAUSE')
		},
	},
})
</script>

<style lang="postcss" scoped>
button {
	@apply w-24 border-none text-4xl text-pink overflow-hidden;
}

.seek-previous, .seek-next {
	transition: 100ms transform;
}

button:hover:not([disabled]) {
	& .seek-previous:active {
		transform: translateX(-12px);
	}
	& .seek-next:active {
		transform: translateX(12px);
	}
}
</style>
