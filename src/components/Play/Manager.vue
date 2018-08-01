<template>
<div class="play-manager">
	<youtube :video-id="youtubeId" ref="youtube" :player-vars="playerVars" @cued="onCued" @ended="onEnded" width="200" height="200" />
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
		}
	},

	computed: {
		songs (): JSONFeedItem[] {
			return this.$store.getters.songs
		},

		paused (): boolean {
			return this.$store.state.playback.paused
		},

		playIndex (): number | null {
			return this.$store.state.playback.index
		},

		hasNextSong (): boolean {
			return this.$store.getters.hasNextSong
		},

		song (): JSONFeedItem | null {
			if (this.playIndex === null) {
				return null
			}
			return this.songs[this.playIndex]
		},

		url (): string | null {
			if (!this.song) {
				return null
			}
			return this.song.external_url || this.song.url || null
		},

		youtubeId (): string | null {
			return this.url ? this.$youtube.getIdFromUrl(this.url) : null
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
	},

	methods: {
		onCued (player: any) {
			player.setPlaybackQuality('small')
			player.unMute()
			player.playVideo()
		},

		onEnded () {
			if (this.hasNextSong) {
				this.$store.commit('SONG_SEEK', 1)
			}
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
