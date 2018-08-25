<template>
<div class="item-icon bg-image rounded animate wh-full" :class="{ youtubeAlign }" :style="{ 'background-image': `url(${url})`, 'background-position': align }" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		align: String,
		url: String,
		size: String,
	},

	computed: {
		youtubeAlign (): boolean {
			return this.align === 'youtube'
		},
	},
})
</script>

<style lang="postcss" scoped>
.item-icon {
	box-shadow: 0 1px 3px #bbb;
	&.youtubeAlign {
		background-size: 263.5%;
		background-position: 9.5% 32%;
	}
}

.selected .item-icon {
	box-shadow: 0 1px 3px #777;
}
</style>
