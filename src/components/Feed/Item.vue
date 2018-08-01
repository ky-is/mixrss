<template>
<li class="feed-item">
	<div class="entry-icon" :style="{ 'background-image': `url(${item.image})` }" />
	<div>{{ item.title }}</div>・
	<time :datetime="date">{{ date.toLocaleDateString() }}</time>
</li>
</template>

<script>
export default {
	props: {
		item: Object,
	},

	computed: {
		date () {
			return new Date(this.item.date_published)
		},
	},
}
</script>

<style scoped>
.feed-item {
	display: flex;
	align-items: center;
}

.entry-icon {
	width: 64px;
	height: 64px;
	background-size: cover;
	margin-right: 8px;
}
</style>
