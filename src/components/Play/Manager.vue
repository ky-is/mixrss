<template>
<div class="play-manager">
	<youtube :video-id="youtubeId" ref="youtube" :player-vars="$options.playerVars" @cued="onCued" width="200" height="200" />
</div>
</template>

<script>
export default {

	playerVars: {
		suggestedQuality: 'small',
	},

	computed: {
		songs () {
			return this.$store.getters.songs
		},

		paused () {
			return this.$store.state.playback.paused
		},

		playIndex () {
			return this.$store.state.playback.index
		},

		song () {
			return this.songs[this.playIndex]
		},

		url () {
			return this.song ? this.song.external_url || this.song.url : null
		},

		youtubeId () {
			return this.url && this.$youtube.getIdFromUrl(this.url)
		},
	},

	watch: {
		paused (paused) {
			const player = this.$refs.youtube.player
			if (paused) {
				player.pauseVideo()
			} else {
				player.playVideo()
			}
		},
	},

	methods: {
		onCued (player) {
			player.setPlaybackQuality('small')
			player.unMute()
			player.playVideo()
		},
	},
}
</script>

<style scoped>
.play-manager {
	position: absolute;
	left: 0;
	top: 0;
	transform: translate(-200px, -200px);
}
</style>
