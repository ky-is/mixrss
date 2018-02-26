<template>
<ul class="feed-list">
	<li v-for="entry in items" :key="entry.id">
		<div class="entry-icon" :style="{ 'background-image': `url(${entry.image})` }" />
		<div>{{ entry.title }}</div>
		<div>{{ Date(entry.date_published) }}</div>
	</li>
</ul>
</template>

<script>
export default {
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
	display: flex;
}

.entry-icon {
	width: 64px;
	height: 64px;
	background-size: cover;
}

</style>
