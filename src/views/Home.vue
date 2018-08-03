<template>
<div class="view-home">
	<div v-if="feedList.length" class="sidebar-container scrolls">
		<TheSidebar :feedList="feedList" />
	</div>
	<div class="feed-container scrolls">
		<div class="feed-content">
			<LoadFeed />
			<FeedAdd />
			<FeedList v-if="feedData" :items="feedData.items" />
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import FeedAdd from '@/components/Feed/Add.vue'
import LoadFeed from '@/components/Feed/Load.vue'
import FeedList from '@/components/Feed/List.vue'

import TheSidebar from '@/components/Sidebar'

export default Vue.extend({
	components: {
		FeedAdd,
		FeedList,
		LoadFeed,
		TheSidebar,
	},

	computed: {
		feedList (): string[] {
			return this.$store.state.feed.list
		},

		feedData (): JSONFeed {
			return this.$store.state.feed.data
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
