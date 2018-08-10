<template>
<div class="play-bar">
	<button @click="onPrevious" :disabled="!hasPreviousSong">⇤</button><!-- ⇤↩︎⏮ -->
	<button @click="onPlay" :disabled="!songs.length">{{ hasSong && !paused ? '◼︎' : '▶︎' }}</button><!-- ▶︎▶️◼︎⏸ -->
	<button @click="onNext" :disabled="!hasNextSong">⇥</button><!-- ⇥↪︎⏭ -->
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		item: Object as () => JSONFeedItem, //TODO https://github.com/vuejs/vue/pull/6856
	},

	computed: {
		playUrl (): string | null {
			return this.$store.state.playback.url
		},

		hasSong (): boolean {
			return this.playUrl !== null
		},

		playbackIndex (): number | null {
			return this.$store.getters.playbackIndex
		},
		hasPreviousSong (): boolean {
			return this.playbackIndex !== null && this.playbackIndex > 0
		},
		hasNextSong (): boolean {
			return this.playbackIndex !== null && this.playbackIndex < this.songs.length - 1
		},

		songs (): JSONFeedItem[] {
			return this.$store.getters.songs
		},

		paused (): boolean {
			return this.$store.state.playback.paused
		},

		date (): Date {
			return new Date(this.item.date_published)
		},
	},

	methods: {
		onPrevious () {
			this.$store.dispatch('SEEK_DIRECTION', -1)
		},
		onNext () {
			this.$store.dispatch('SEEK_DIRECTION', 1)
		},

		onPlay () {
			this.$store.dispatch('PRESS_PAUSE')
		},
	},
})
</script>

<style scoped>
.play-bar {
	background: #eee;

	display: flex;
	align-items: stretch;
	justify-content: center;
}

button {
	background: none;
	border: none;
	font-size: 32px;
	color: #f59;
	width: 80px;
}
</style>
