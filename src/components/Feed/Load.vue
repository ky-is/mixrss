<template>
<form @submit.prevent="onEnterFeedUrl" class="load-feed">
	<input type="text" v-model.trim="feedUrl" placeholder="https://some.playlist/feed.json" autocomplete="off" autocorrect="off">
	<button type="submit">Load</button>
	<button @click.prevent="onClear">╳</button>
</form>
</template>

<script>
export default {
	data () {
		return {
			feedUrl: null,
		}
	},

	computed: {
		currentFeedUrl () {
			return this.$store.state.currentFeed.url
		},

		currentFeedModified () {
			return this.$store.state.currentFeed.modified
		},
	},

	created () {
		this.feedUrl = this.currentFeedUrl
	},

	methods: {
		permit () {
			return !this.currentFeedModified || window.confirm("You've modified the current feed. Make sure you've exported any changes that you want to keep, or press 'Cancel'.")
		},

		onEnterFeedUrl () {
			if (!this.permit()) {
				return
			}
			this.$store.dispatch('ADD_FEED_URL', this.feedUrl)
		},

		onClear () {
			if (!this.permit()) {
				return
			}
			this.$store.commit('CLEAR_FEED')
		},
	},
}
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
