<template>
<div class="play-manager">
	<youtube :video-id="youtubeId" ref="youtube" :player-vars="playerVars" @cued="onCued" @playing="onPaused(false)" @paused="onPaused(true)" @ended="onEnded" width="200" height="200" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	data () {
		return {
			playerVars: {
				suggestedQuality: 'small',
			},
			loading: false,
		}
	},

	computed: {
		paused (): boolean {
			return this.$store.state.playback.paused
		},

		playUrl (): number | null {
			return this.$store.state.playback.url
		},

		youtubeId (): string | null {
			return this.playUrl ? this.$youtube.getIdFromUrl(this.playUrl) : null
		},
	},

	watch: {
		paused (paused) {
			const player = (this.$refs.youtube as any).player
			if (paused) {
				player.pauseVideo()
			} else {
				player.playVideo()
			}
		},

		youtubeId () {
			this.loading = true
		},
	},

	methods: {
		onCued (player: any) {
			if (!this.youtubeId) {
				return
			}
			this.loading = false
			player.setPlaybackQuality('small')
			player.unMute()
			if (!this.paused) {
				player.playVideo()
			}
		},

		onPaused (paused: boolean) {
			if (paused && this.loading) {
				return
			}
			this.$store.dispatch('PRESS_PAUSE', paused)
		},

		onEnded () {
			this.$store.dispatch('SEEK_DIRECTION', 1)
		},
	},
})
</script>

<style scoped>
.play-manager {
	position: absolute;
	left: 0;
	top: 0;
	transform: translate(-200px, -200px);
}
</style>
