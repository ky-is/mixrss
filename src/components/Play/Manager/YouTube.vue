<template>
<youtube ref="youtube" :videoId="id" :playerVars="playerVars" width="200" height="200" @cued="onCued" @playing="onPaused(false)" @paused="onPaused(true)" @ended="onEnded" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		id: {
			type: String as () => string | null,
			default: null,
		},
		paused: {
			type: Boolean,
			required: true,
		},
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
		id () {
			this.loading = true
		},

		paused (paused: boolean) {
			if (!this.id) {
				return
			}
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
			if (!this.id) {
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
			if (!this.id || (paused && this.loading)) {
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
