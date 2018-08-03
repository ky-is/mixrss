<template>
<div class="view-home inherit">
	<div class="sidebar-container">
		<TheSidebar />
	</div>
	<div class="feed-container">
		<LoadFeed />
		<FeedAdd />
		<FeedList v-if="feedData" :items="feedData.items" />
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

.sidebar-container {
	width: 288px;
	height: 100%;
	padding-bottom: 80px;
	box-sizing: border-box;
	background-color: #f7f7f7;
}

.feed-container {
	margin: auto;
	margin-bottom: 80px;
	max-width: 600px;
	padding: 8px;
	box-sizing: border-box;
}
</style>
