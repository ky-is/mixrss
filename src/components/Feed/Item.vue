<template>
<li class="feed-item hover-outer">
	<div @click="onItem(index)" class="item-icon" :style="{ 'background-image': `url(${item.image})` }" />
	<div>
		<div>{{ item.title }}</div>
		<div class="text-small text-faint hover-inner">
			<div>
				<span>{{ item.duration || item.summary }}</span>
				・
				<time :datetime="date">{{ date.toLocaleDateString() }}</time>
				・
				<span class="tags">
					<span v-if="tags">
						<button v-for="tag in tags" @click.stop="onTag(tag)" class="button-modify button-tag hide-parent" :key="tag">{{ tag }}<span class="tag-delete hide-child">✖︎</span></button>
					</span>
					<button @click.stop="onTagAdd" class="button-modify button-outline">+Tag</button>
				</span>
			</div>
			<div class="description-container">
				<span v-if="item.description" class="description" :title="item.description">{{ item.description }}&nbsp;</span>
				<button @click.stop="onNoteEdit" class="button-modify button-outline">{{ item.description ? 'Edit' : '+Note' }}</button>
			</div>
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
			this.$store.commit('SONG_TAG', { item: this.item, tag, add: false })
		},

		onTagAdd () {
			const tag = window.prompt('Please enter a tag this song belongs to.')
			if (tag) {
				this.$store.commit('SONG_TAG', { item: this.item, tag, add: true })
			}
		},

		onNoteEdit () {
			const description = window.prompt('Enter a description to show to listeners of this song.', this.item.description)
			if (description !== null) {
				this.$store.commit('SONG_DESCRIPTION', { item: this.item, description })
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
	border-radius: 2px;
}

.feed-item:hover {
	background-color: #eee;
}
.feed-item:hover:active {
	background-color: #ddd;
}

.feed-item.selected {
	background: #fde !important;
}

.item-icon {
	width: 64px;
	height: 64px;
	border-radius: 3px;
	background-size: cover;
	margin-right: 8px;
	flex-shrink: 0;
	transition: box-shadow 500ms;
}

.item-icon:hover {
	cursor: pointer;
}

.selected .item-icon {
	box-shadow: 0 1px 2px #333;
}

.button-modify {
	border-radius: 6px;
	padding: 0 4px;
	padding-bottom: 1px;
	margin-right: 4px;
	border-color: transparent;
}

button.button-outline, .button-tag:hover {
	border-color: #777;
}
.button-modify:hover {
	background: #fff;
}

.tag-delete {
	line-height: 0;
	margin-left: 2px;
	font-size: 14px;
}

.description-container {
	display: flex;
}
.description {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
