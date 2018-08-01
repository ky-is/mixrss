<template>
<ul class="feed-list">
	<FeedItem v-for="(item, index) in items" :item="item" :index="index" :key="item.id" :class="{ selected: index === playIndex }" />
</ul>
</template>

<script>
import FeedItem from '@/components/Feed/Item'

export default {
	components: {
		FeedItem,
	},

	props: {
		items: Array,
	},

	computed: {
		playIndex () {
			return this.$store.state.playback.index
		},
	},
}
</script>

<style scoped>
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
</style>
