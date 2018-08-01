<template>
<li @click="onItem(index)" class="feed-item">
	<div class="entry-icon" :style="{ 'background-image': `url(${item.image})` }" />
	<div>{{ item.title }}</div>・
	<time :datetime="date">{{ date.toLocaleDateString() }}</time>
</li>
</template>

<script>
export default {
	props: {
		index: Number,
		item: Object,
	},

	computed: {
		date () {
			return new Date(this.item.date_published)
		},
	},

	methods: {
		onItem (index) {
			this.$store.commit('SONG_SET', index)
		},
	},
}
</script>

<style scoped>
.feed-item {
	display: flex;
	align-items: center;
	padding: 8px;
	transition: background-color 200ms;
}

.feed-item:hover {
	cursor: pointer;
	background-color: #eee;
}
.feed-item:hover:active {
	background-color: #ddd;
}

.feed-item.selected {
	background: #fde !important;
}

.entry-icon {
	width: 64px;
	height: 64px;
	background-size: cover;
	margin-right: 8px;
}
</style>
