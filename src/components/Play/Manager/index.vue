<template>
<div class="play-manager absolute pin-t">
	<SoundCloudManager v-if="soundcloudUrl" :url="soundcloudUrl" :paused="paused" @playing="onPlaying" @ended="onEnded" />
	<YouTubeManager :videoId="youtubeId" :paused="paused" @playing="onPlaying" @ended="onEnded" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import SoundCloudManager from '@/components/Play/Manager/SoundCloud.vue'
import YouTubeManager from '@/components/Play/Manager/YouTube.vue'

export default Vue.extend({
	components: {
		SoundCloudManager,
		YouTubeManager,
	},

	computed: {
		paused (): boolean {
			return this.$store.state.playback.paused
		},

		playUrl (): string | null {
			return this.$store.state.playback.url
		},

		youtubeId (): string | null {
			return this.playUrl ? this.$youtube.getIdFromUrl(this.playUrl) : null
		},

		soundcloudUrl (): string | null {
			const url = this.playUrl
			return url && url.toLowerCase().indexOf('soundcloud.com') !== -1 ? url : null
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
	transform: translate(-200px, -400px);
}
</style>
