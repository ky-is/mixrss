<template>
<div class="play-manager absolute pin-t">
	<SoundCloudManager :id="soundcloudId" :paused="paused" @playing="onPlaying" @ended="onEnded" />
	<YouTubeManager :id="youtubeId" :paused="paused" @playing="onPlaying" @ended="onEnded" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import SoundCloudManager from '@/components/Play/Manager/SoundCloud.vue'
import YouTubeManager from '@/components/Play/Manager/YouTube.vue'

export default Vue.extend({
	components: {
		SoundCloudManager,
		YouTubeManager,
	},

	computed: {
		paused (): boolean {
			return store.state.playback.paused
		},

		id (): string | null {
			return store.state.playback.id
		},
		splitId (): string[] {
			return this.id ? this.id.split(':') : []
		},
		playType (): string | null {
			return this.splitId[0]
		},
		playId (): string | null {
			return this.splitId[1]
		},

		youtubeId (): string | null {
			return this.playType === 'yt' ? this.playId : null
		},
		soundcloudId (): string | null {
			return this.playType === 'sc' ? this.playId : null
		},
	},

	methods: {
		onPlaying (playing: boolean) {
			store.dispatch('PRESS_PAUSE', !playing)
		},

		onEnded () {
			store.dispatch('SEEK_DIRECTION', 1)
		},
	},
})
</script>

<style scoped>
.play-manager {
	transform: translate(-200px, -200px);
}
</style>
