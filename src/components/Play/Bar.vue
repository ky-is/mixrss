<template>
<div class="bg-gray-300 border-t  flex justify-center">
	<div class="w-64 ml-2 min-w-0  flex items-center">
		<div class="wh-12 flex-shrink-0">
			<AlbumArt v-if="item" :url="item.image" :align="item._imageAlign" size="full" />
		</div>
		<div class="ml-2 overflow-hidden cursor-default flex-initial">
			<template v-if="item">
				<div :title="songTitle" class="text-sm truncate">{{ songTitle }}</div>
				<div v-if="albumTitle" :title="albumTitle" class="text-xs leading-tight truncate">{{ albumTitle }}</div>
			</template>
		</div>
	</div>
	<div class="w-64  flex items-stretch">
		<button :disabled="!hasPreviousSong" class="media-button" @click="onPrevious">
			<svg class="seek-previous" viewBox="0 0 24 24">
				<path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
				<path d="M0 0h24v24H0z" fill="none" />
			</svg>
		</button>
		<button :disabled="!canPlayPause" class="media-button" @click="onPlay">
			<svg width="63" height="63" viewBox="0 0 36 36">
				<path v-if="hasSong && !paused" d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" />
				<path v-else d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" />
			</svg>
		</button>
		<button :disabled="!hasNextSong" class="media-button" @click="onNext">
			<svg class="seek-next" viewBox="0 0 24 24">
				<path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
				<path d="M0 0h24v24H0z" fill="none" />
			</svg>
		</button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { JSONFeedItem } from '@/types/jsonfeed'

import AlbumArt from '@/components/Feed/AlbumArt.vue'

export default Vue.extend({
	components: {
		AlbumArt,
	},

	data () {
		return {
			item: undefined as JSONFeedItem | undefined,
		}
	},

	computed: {
		splitTitle (): string[] | undefined {
			const item = this.item
			if (item && item.title) { //?.
				let split = item.title.split(' - ')
				if (split.length !== 2) {
					split = item.title.split(' | ')
				}
				if (split.length === 2) {
					return split
				}
			}
			return undefined
		},
		songTitle (): string | undefined {
			return this.splitTitle ? this.splitTitle[1] : (this.item && this.item.title)
		},
		albumTitle (): string | undefined {
			return this.splitTitle && this.splitTitle[0]
		},

		playId (): string | null {
			return store.state.playback.id
		},
		hasSong (): boolean {
			return this.playId !== null
		},

		songs (): JSONFeedItem[] {
			return store.getters.songs
		},

		canPlayPause (): boolean {
			return this.hasSong || !!this.songs.length
		},

		playbackIndex (): number | null {
			return store.getters.playbackIndex
		},
		hasPreviousSong (): boolean {
			return this.playbackIndex !== null && this.playbackIndex > 0
		},
		hasNextSong (): boolean {
			return this.playbackIndex !== null && this.playbackIndex < this.songs.length - 1
		},

		paused (): boolean {
			return store.state.playback.paused
		},
	},

	watch: {
		playId (playId) {
			const data = store.state.feed.data
			if (data && data.items) { //?.
				this.item = data.items.find(item => item.id === playId)
			}
		},
	},

	methods: {
		onPlay () {
			store.dispatch('PRESS_PAUSE')
		},

		onPrevious () {
			store.dispatch('SEEK_DIRECTION', -1)
		},
		onNext () {
			store.dispatch('SEEK_DIRECTION', 1)
		},
	},
})
</script>

<style lang="postcss" scoped>
.media-button {
	@apply w-24 border-none text-brand-500 overflow-hidden;
	& svg {
		@apply mx-auto;
	}
	&:not([disabled]):hover {
		& .seek-previous:active {
			transform: translateX(-12px);
		}
		& .seek-next:active {
			transform: translateX(12px);
		}
	}
}

.seek-previous, .seek-next {
	@apply wh-10;
	transition: 100ms transform;
}
</style>
