<template>
<div class="view-home flex h-full">
	<div v-if="feedData" class="sidebar-container scrolls">
		<TheSidebar :feedList="feedList" />
	</div>
	<div class="scrolls w-full">
		<div class="feed-content m-auto p-2">
			<FeedCreate v-if="!feedData || addingFeed" />
			<div v-else>
				<FeedEdit />
				<FeedTags :items="feedData.items" />
				<FeedList />
			</div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

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

	computed: {
		feedList (): string[] {
			return store.state.feed.list
		},

		feedData (): JSONFeed | null {
			return store.state.feed.data
		},

		addingFeed (): boolean {
			return store.state.local.addingFeed
		},
	},
})
</script>

<style lang="postcss" scoped>
.scrolls {
	@apply h-full overflow-y-scroll;
}

.sidebar-container {
	width: 288px;
	@apply bg-grey-lightest;
}

.feed-content {
	max-width: 600px;
}
</style>
