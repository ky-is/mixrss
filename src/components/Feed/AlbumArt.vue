<template>
<div
	:style="{ 'background-image': `url(${url})`, 'background-position': align }"
	:class="{ youtubeAlign }" class="item-icon bg-image rounded animate wh-full"
/>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		align: {
			type: String,
			default: undefined,
		},
		url: {
			type: String,
			required: true,
		},
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
