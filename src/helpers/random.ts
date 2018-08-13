export default {

	item (array: any[]): any {
		const length = array.length
		return length ? array[Math.floor(Math.random() * length)] : null
	},

}
