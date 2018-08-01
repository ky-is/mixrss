<template>
<ul class="feed-list">
	<FeedItem v-for="item in items" :item="item" :key="item.id" />
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
}
</script>

<style scoped>
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

li {
	margin: 8px;
}
</style>
