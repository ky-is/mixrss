<template>
<div v-if="loading">
	<h2>Loading requested feed...</h2>
</div>
<div v-else>
	<h2>Load a remote feed</h2>
	<form @submit.prevent="onEnterFeedUrl" class="load-feed flex">
		<input type="url" v-model.trim="url" placeholder="https://some.playlist/feed.json" autocomplete="off" autocorrect="off">
		<button type="submit" class="button-load">Load</button>
	</form>
	<div v-if="!hasLocalFeed" class="text-center">
		<div class="my-8">~ or ~</div>
		<button @click="onCreateFeed" class="backed">Create a new feed</button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

export default Vue.extend({
	data () {
		return {
			url: null as string | null,
		}
	},

	computed: {
		loading (): boolean {
			return store.state.feed.loading > 0
		},

		hasLocalFeed (): boolean {
			const feed = store.state.feed.url ? store.getters.feedForUrl(null) : store.state.feed.data
			return feed !== null
		},
	},

	methods: {
		onEnterFeedUrl () {
			store.dispatch('LOAD_FEED_URL', { url: this.url, adding: true }).then(loadedUrl => {
				if (loadedUrl === this.url) {
					store.commit('TOGGLE_ADD_FEED', false)
				}
			}, error => {
				window.alert('A valid feed could not be found at this URL, please try again. ' + error)
			})
		},

		onCreateFeed () {
			store.dispatch('CREATE_LOCAL_FEED')
		},
	},
})
</script>

<style scoped>
.load-feed {
	height: 44px;
}

input {
	flex-grow: 9;
}

.button-load {
	flex-grow: 1;
	min-width: 64px;
}
</style>
