<template>
<div class="play-bar">
	<button>{{ paused ? '◼︎' : '▶︎' }}</button><!-- ⇥⇤↪︎↩︎▶️⏸⏭⏮ -->
</div>
</template>

<script>
export default {
	props: {
		item: Object,
	},

	computed: {
		paused () {
			return this.$store.state.playback.paused
		},

		date () {
			return new Date(this.item.date_published)
		},
	},
}
</script>

<style scoped>
.play-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 80px;
	background: #eee;

	display: flex;
	align-items: stretch;
	justify-content: center;
}

button {
	background: none;
	border: none;
	font-size: 32px;
	color: #f59;
	width: 80px;
}
</style>
