<template>
<div class="sidebar">
	<SidebarItem :url="null" :selected="currentUrl === null" />
	<SidebarItem v-for="url in feedList" :url="url" :selected="currentUrl === url" :key="url" />
	<button @click="onAddFeed" class="unstyled w-full theme-color font-bold h-12">{{ addingFeed ? 'Cancel' : 'Add new feed' }}</button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

import SidebarItem from '@/components/Sidebar/Item.vue'

export default Vue.extend({
	components: {
		SidebarItem,
	},

	props: {
		feedList: Array as () => string[], //TODO https://github.com/vuejs/vue/pull/6856
	},

	computed: {
		addingFeed (): boolean {
			return this.$store.state.local.addingFeed
		},

		feedUrl (): string | null {
			return this.$store.state.feed.url
		},

		currentUrl () {
			return this.addingFeed ? undefined : this.feedUrl
		},
	},

	methods: {
		onAddFeed () {
			this.$store.commit('TOGGLE_ADD_FEED')
		},
	},
})
</script>
