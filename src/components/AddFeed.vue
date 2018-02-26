<template>
<div class="add-feed">
	<input type="text" v-model.trim="feedUrl" @keyup.enter="onEnterFeedUrl" class="" placeholder="https://some.playlist/feed.json" autocomplete="off" autocorrect="off">
	<button type="submit" @click="onEnterFeedUrl" class="">Submit</button>
</div>
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
		},
	},

	created () {
	},

	methods: {
		onEnterFeedUrl () {
		},
	},
}
</script>

<style scoped>

</style>
