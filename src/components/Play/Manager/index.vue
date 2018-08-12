<template>
<div class="play-manager">
	<YouTubeManager :videoId="youtubeId" :paused="paused" @playing="onPlaying" @ended="onEnded" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import YouTubeManager from '@/components/Play/Manager/YouTube.vue'

export default Vue.extend({
	components: {
		YouTubeManager,
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

	methods: {
		onPlaying (playing: boolean) {
			this.$store.dispatch('PRESS_PAUSE', !playing)
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
