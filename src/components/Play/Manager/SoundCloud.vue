<script lang="ts">
import Vue from 'vue'
import SoundCloud from 'soundcloud'

import soundcloudIds from '@/helpers/soundcloud_ids'

export default Vue.extend({
	props: {
		id: {
			type: String,
			required: true,
		},
		paused: {
			type: Boolean,
			required: true,
		},
	},

	data () {
		return {
			loading: false,
			player: null as any,
		}
	},

	watch: {
		id: {
			immediate: true,
			handler (id) {
				if (id) {
					this.loading = true
					SoundCloud.stream(`tracks/${id}`)
						.then((player: any) => {
							this.loading = false
							if (this.id === id) {
								if (!this.paused) {
									player.play()
								}
								player.on('play-resume', this.onPlay)
								player.on('pause', this.onPaused)
								player.on('finish', this.onEnded)
								this.player = player
							}
						})
				} else if (this.player) {
					this.player.kill()
					this.player = null
				}
			},
		},

		paused (paused: boolean) {
			if (!this.player) {
				return
			}
			if (paused) {
				this.player.pause()
			} else {
				this.player.play()
			}
		},
	},

	created () {
		const client_id = soundcloudIds.next()
		SoundCloud.initialize({ client_id })
	},

	methods: {
		onPlay () {
			this.$emit('playing', true)
		},

		onPaused () {
			if (!this.id || !this.player) {
				return
			}
			this.$emit('playing', false)
		},

		onEnded () {
			this.$emit('ended')
		},

		onError (error: string) {
			window.alert(error)
		},
	},

	render () {
		return null as any
	},
})
</script>
