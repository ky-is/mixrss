<template>
<div class="h-16 bg-grey-lighter  flex flex-no-shrink items-stretch justify-center">
	<button @click="onPrevious" :disabled="!hasPreviousSong">⇤</button> <!-- ⇤↩︎⏮ -->
	<button @click="onPlay" :disabled="!songs.length">{{ hasSong && !paused ? '◼︎' : '▶︎' }}</button> <!-- ▶︎▶️◼︎⏸ -->
	<button @click="onNext" :disabled="!hasNextSong">⇥</button> <!-- ⇥↪︎⏭ -->
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
	@apply w-24 border-none text-4xl text-pink;
}
</style>
