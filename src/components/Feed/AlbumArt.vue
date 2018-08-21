<template>
<div class="item-icon bg-image mr-2 rounded animate" :class="classes" :style="{ 'background-image': `url(${url})`, 'background-position': align }" />
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
		classes (): object {
			return {
				[`wh-${this.size}`]: true,
				youtube: this.align === 'youtube',
			}
		},
	},
})
</script>

<style lang="postcss" scoped>
.item-icon {
	box-shadow: 0 1px 3px #bbb;
	&.youtube {
		background-size: 262%;
		background-position: -9.5px -9.5px;
	}
}

.selected .item-icon {
	box-shadow: 0 1px 3px #777;
}
</style>
