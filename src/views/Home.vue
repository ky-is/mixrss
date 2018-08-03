<template>
<div class="view-home inherit">
	<div class="sidebar-container">
		<TheSidebar />
	</div>
	<div class="feed-container">
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
}

.sidebar-container, .feed-container {
	overflow-y: scroll;
	height: inherit;
}

.sidebar-container {
	width: 288px;
	padding-bottom: 80px;
	box-sizing: border-box;
	background-color: #f7f7f7;
}

.feed-container {
	width: 100%;
	padding-bottom: 80px;
	box-sizing: border-box;
}

.feed-content {
	max-width: 600px;
	margin: auto;
	padding: 8px;
	box-sizing: border-box;
}

@media (max-width: 900px) {
}
</style>
