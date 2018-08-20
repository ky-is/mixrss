<template>
<div class="flex h-full">
	<div v-if="feedData" class="sidebar-container scrolls animate" :class="{ showsSidebar }">
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

import { JSONFeed } from '@/types/jsonfeed'

export default Vue.extend({
	components: {
		FeedCreate,
		FeedEdit,
		FeedList,
		FeedTags,
		TheSidebar,
	},

	computed: {
		showsSidebar (): boolean {
			return store.getters.showsSidebar
		},

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
	@apply bg-grey-lightest border-r;
	width: 288px;
	left: -288px;
	transition-property: left;
	&.showsSidebar {
		left: 0;
	}
	@media (width < 576px) {
		@apply absolute z-20;
		max-height: calc(100% - 64px - 42px);
	}
}

.feed-content {
	max-width: 600px;
}
</style>
