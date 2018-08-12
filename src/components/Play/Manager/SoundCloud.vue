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
			disableChrome: null as boolean | null,
		}
	},

	computed: {
		playbackUrl (): string | null {
			return this.disableChrome !== true ? `https://w.soundcloud.com/player/?url=${this.url}&auto_play=true&show_artwork=false&single_active=false&buying=false&sharing=false&download=false&show_playcount=false&show_user=false` : null
		},
	},

	watch: {
		url: {
			immediate: true,
			handler () {
				this.loading = true
				if (this.disableChrome === null && window.hasOwnProperty('chrome')) {
					const splitChrome = navigator.appVersion.split('Chrome/')[1]
					if (splitChrome) {
						const splitVersion = splitChrome.split('.')[0]
						const version = parseInt(splitVersion, 10)
						if (!isNaN(version) && version < 70) {
							this.disableChrome = window.confirm('SoundCloud playback may not work in your current version of Chrome. You can try another browser instead, or continue instead.')
						}
					}
				}
			},
		},
	
		paused (paused: boolean) {
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
			this.player.setVolume(100)
		},

		onPlay () {
			if (this.paused) {
				this.$emit('playing', true)
			}
		},

		onPaused () {
			if (!this.paused) {
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
