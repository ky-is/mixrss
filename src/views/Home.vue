<template>
<div class="view-home">
	<div v-if="feedData" class="sidebar-container scrolls">
		<TheSidebar :feedList="feedList" />
	</div>
	<div class="feed-container scrolls">
		<FeedCreate v-if="!feedData || addingFeed" :showCreate="!feedData" class="feed-content" />
		<div v-else class="feed-content">
			<FeedEdit />
			<FeedTags v-model="selectedTags" :items="feedData.items" />
			<FeedList :items="feedData.items" :tags="selectedTags" />
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import FeedCreate from '@/components/Create/Feed.vue'

import FeedEdit from '@/components/Feed/Edit.vue'
import FeedList from '@/components/Feed/List.vue'
import FeedTags from '@/components/Feed/Tags.vue'

import TheSidebar from '@/components/Sidebar/index.vue'

export default Vue.extend({
	components: {
		FeedCreate,
		FeedEdit,
		FeedList,
		FeedTags,
		TheSidebar,
	},

	data () {
		return {
			selectedTags: [] as string[]
		}
	},

	computed: {
		feedList (): string[] {
			return this.$store.state.feed.list
		},

		feedData (): JSONFeed {
			return this.$store.state.feed.data
		},

		addingFeed (): boolean {
			return this.$store.state.local.addingFeed
		},
	},
})
</script>

<style>
.view-home {
	display: flex;
	align-items: stretch;
	height: 100%;
}

.scrolls {
	height: 100%;
	box-sizing: border-box;
	overflow-y: scroll;
}

.sidebar-container {
	width: 288px;
	background-color: #f7f7f7;
}

.feed-container {
	width: 100%;
}

.feed-content {
	max-width: 600px;
	margin: auto;
	padding: 8px;
}

@media (max-width: 900px) {
}
</style>
