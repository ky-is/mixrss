<template>
<div>
	<h2>Load a remote feed</h2>
	<form @submit.prevent="onEnterFeedUrl" class="load-feed">
		<input type="url" v-model.trim="url" placeholder="https://some.playlist/feed.json" autocomplete="off" autocorrect="off">
		<button type="submit" class="button-load">Load</button>
	</form>
	<div v-if="showCreate" class="text-center">
		<div class="separator">~ or ~</div>
		<button @click="onCreateFeed" class="backed">Create a new feed</button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		showCreate: Boolean,
	},

	data () {
		return {
			url: null as string | null,
		}
	},

	methods: {
		onEnterFeedUrl () {
			if (!this.permit()) {
				return
			}
			this.$store.dispatch('LOAD_FEED_URL', this.url)
		},

		onCreateFeed () {
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

.button-load {
	flex-grow: 1;
	min-width: 64px;
}

.separator {
	margin: 32px 0;
}
</style>
