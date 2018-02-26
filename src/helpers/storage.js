let storage = false
{
	const sampleDate = new Date()
	try {
		window.localStorage.setItem(sampleDate, sampleDate)
		window.localStorage.removeItem(sampleDate)
		storage = window.localStorage
	} catch (e) {
		console.error(e)
	}
}

export default {

	get (key, defaultValue = null) {
		if (storage) {
			const value = storage.getItem(key)
			if (value !== undefined && value !== 'null') {
				return value
			}
		}
		return defaultValue
	},

	set (key, value) {
		return storage && storage.setItem(key, value)
	},

	remove (key) {
		return storage && storage.removeItem(key)
	},

	getJSON (key) {
		const raw = this.get(key)
		if (raw) {
			try {
				return JSON.parse(raw)
			} catch (e) {
				console.log('Invalid json', key, raw)
				storage.removeItem(key)
			}
		}
		return null
	},

	setJSON (key, value) {
		return this.set(key, JSON.stringify(value))
	},

}
