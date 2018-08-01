<template>
<div class="play-bar">
	<button @click="onPrevious" :disabled="!hasPreviousSong">⇤</button><!-- ⇤↩︎⏮ -->
	<button @click="onPlay" :disabled="!songs.length">{{ hasSong && !paused ? '◼︎' : '▶︎' }}</button><!-- ▶︎▶️◼︎⏸ -->
	<button @click="onNext" :disabled="!hasNextSong">⇥</button><!-- ⇥↪︎⏭ -->
</div>
</template>

<script>
export default {
	props: {
		item: Object,
	},

	computed: {
		playbackIndex () {
			return this.$store.state.playback.index
		},

		hasSong () {
			return this.playbackIndex !== null
		},
		hasPreviousSong () {
			return this.playbackIndex >= 1
		},
		hasNextSong () {
			return this.playbackIndex < this.songs.length - 1
		},

		songs () {
			return this.$store.getters.songs
		},

		paused () {
			return this.$store.state.playback.paused
		},

		date () {
			return new Date(this.item.date_published)
		},
	},

	methods: {
		onPrevious () {
			this.$store.commit('SONG_SEEK', -1)
		},
		onNext () {
			this.$store.commit('SONG_SEEK', 1)
		},

		onPlay () {
			this.$store.commit('SONG_TOGGLE')
		},
	},
}
</script>

<style scoped>
.play-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 80px;
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
