<template>
<li @click="onItem(index)" class="feed-item">
	<div class="entry-icon" :style="{ 'background-image': `url(${item.image})` }" />
	<div>
		<div>{{ item.title }}</div>
		<div class="text-small text-faint">
			<span>{{ item.duration || item.summary }}</span>
			・
			<time :datetime="date">{{ date.toLocaleDateString() }}</time>
			・
			<span class="tags">
				<span v-if="tags">
					<button v-for="tag in tags" @click.stop="onTag(tag)" class="button-tag hide-parent" :key="tag">{{ tag }}<span class="tag-delete hide-child">✖︎</span></button>
				</span>
				<button @click.stop="onTagAdd" class="button-outline">+Tag</button>
			</span>
		</div>
	</div>
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

		tags () {
			// return [ 'Post-Rock' ]
			const tags = this.item.tags
			return tags && tags.length ? tags : null
		},
	},

	methods: {
		onItem (index) {
			this.$store.commit('SONG_SET', index)
		},

		onTag (tag) {
			console.log(tag)
			this.$store.commit('TAG', { item: this.item, tag, add: false })
		},

		onTagAdd () {
			const tag = window.prompt('Please enter a tag this song belongs to.')
			console.log(tag)
			if (tag) {
				this.$store.commit('TAG', { item: this.item, tag, add: true })
			}
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

.tags button {
	border-radius: 6px;
	padding: 0 4px;
	padding-bottom: 1px;
	margin-right: 4px;
	border-color: transparent;
}

button.button-outline, .button-tag:hover {
	border-color: #777;
}
.tags button:hover {
	background: #fff;
}

.tag-delete {
	line-height: 0;
	margin-left: 2px;
	font-size: 14px;
}

</style>
