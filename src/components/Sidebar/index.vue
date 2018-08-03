<template>
<div class="sidebar">
	<div v-for="feedUrl in feedList" :key="feedUrl">
		{{ feedUrl }}
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	computed: {
		feedList (): string[] {
			return this.$store.state.feed.list
		},
	},
})
</script>

<style scoped>
.sidebar {
	width: 100%;
	padding: 8px;
	box-sizing: border-box;
	overflow: hidden scroll;
}
</style>
