<template>
<form @submit.prevent="onEnterFeedUrl" class="load-feed">
	<input type="url" v-model.trim="url" placeholder="https://some.playlist/feed.json" autocomplete="off" autocorrect="off">
	<button type="submit">Load</button>
	<button @click.prevent="onClear">╳</button>
</form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	data () {
		return {
			url: null as string | null,
		}
	},

	computed: {
		feedUrl (): string | null {
			return this.$store.state.feed.url
		},

		feedModified (): boolean {
			return this.$store.state.feed.modified
		},
	},

	watch: {
		feedUrl: {
			immediate: true,
			handler (feedUrl) {
				this.url = feedUrl
			},
		},
	},

	methods: {
		permit (): boolean {
			return !this.feedModified || window.confirm("You've modified the current feed. Make sure you've exported any changes that you want to keep, or press 'Cancel'.")
		},

		onEnterFeedUrl () {
			if (!this.permit()) {
				return
			}
			this.$store.dispatch('LOAD_FEED_URL', this.url)
		},

		onClear () {
			if (!this.permit()) {
				return
			}
			this.$store.commit('CLEAR_FEED')
		},
	},
})
</script>

<style scoped>
.load-feed {
	display: flex;
	height: 44px;
}

input {
	flex-grow: 9;
}

button {
	flex-grow: 1;
	min-width: 64px;
}
</style>
