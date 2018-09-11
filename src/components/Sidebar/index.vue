<template>
<div>
	<ul class="pt-4">
		<SidebarItem :url="null" :selected="currentUrl === null" />
		<SidebarItem v-for="url in feedList" :url="url" :selected="currentUrl === url" :key="url" />
	</ul>
	<button class="unstyled w-full text-brand-light font-bold h-12" @click="onAddFeed">{{ !showsSidebar && addingFeed ? 'Cancel' : 'Add new feed' }}</button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import SidebarItem from '@/components/Sidebar/Item.vue'

export default Vue.extend({
	components: {
		SidebarItem,
	},

	props: {
		feedList: {
			type: Array as () => string[],
			required: true,
		},
	},

	computed: {
		showsSidebar (): boolean {
			return store.getters.showsSidebar
		},

		addingFeed (): boolean {
			return store.state.local.addingFeed
		},

		feedUrl (): string | null {
			return store.state.feed.url
		},

		currentUrl (): string | null | undefined {
			return this.addingFeed ? undefined : this.feedUrl
		},
	},

	methods: {
		onAddFeed () {
			store.commit('TOGGLE_SIDEBAR', false)
			store.commit('TOGGLE_ADD_FEED')
		},
	},
})
</script>
