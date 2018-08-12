<template>
<youtube :video-id="videoId" :player-vars="playerVars" ref="youtube" @cued="onCued" @playing="onPaused(false)" @paused="onPaused(true)" @ended="onEnded" width="200" height="200" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		videoId: String,
		paused: Boolean,
	},

	data () {
		return {
			playerVars: {
				suggestedQuality: 'small',
			},
			loading: false,
		}
	},

	watch: {
		videoId () {
			this.loading = true
		},
	
		paused (paused) {
			const player = (this.$refs.youtube as any).player
			if (paused) {
				player.pauseVideo()
			} else {
				player.playVideo()
			}
		},
	},

	methods: {
		onCued (player: any) {
			if (!this.videoId) {
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
			this.$emit('playing', !paused)
		},

		onEnded () {
			this.$emit('ended')
		},
	},
})
</script>
