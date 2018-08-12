<template>
<iframe :src="playbackUrl" ref="soundcloud" width="200" height="200" frameborder="no" />
</template>

<script lang="ts">
import Vue from 'vue'

import SoundCloud from '@/helpers/soundcloud'

export default Vue.extend({
	props: {
		url: String,
		paused: Boolean,
	},

	data () {
		return {
			loading: false,
			player: null as any,
		}
	},

	computed: {
		playbackUrl (): string | null {
			return this.url ? `https://w.soundcloud.com/player/?url=${this.url}&auto_play=false&show_artwork=false&single_active=false&buying=false&sharing=false&download=false&show_playcount=false&show_user=false` : null
		},
	},

	watch: {
		url () {
			this.loading = true
			this.player.setVolume(100)
			this.player.play()
		},
	
		paused (paused) {
			if (paused) {
				this.player.pause()
			} else {
				this.player.play()
			}
		},
	},

	mounted () {
		const player = SoundCloud.Widget(this.$refs.soundcloud)
		player.bind(SoundCloud.Widget.Events.READY, this.onCued)
		player.bind(SoundCloud.Widget.Events.PLAY, this.onPlay)
		player.bind(SoundCloud.Widget.Events.PAUSE, this.onPaused)
		player.bind(SoundCloud.Widget.Events.FINISH, this.onEnded)
		player.bind(SoundCloud.Widget.Events.ERROR, this.onError)
		this.player = player
	},

	methods: {
		onCued () {
			this.loading = false
			this.player.play()
		},

		onPlay () {
			this.$emit('playing', true)
		},

		onPaused () {
			if (!this.loading) {
				this.$emit('playing', false)
			}
		},

		onEnded () {
			this.$emit('ended')
		},

		onError (error: string) {
			window.alert(error)
		},
	},
})
</script>
