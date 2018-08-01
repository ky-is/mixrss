interface Storage {
	getItem(key: string): string | null
	setItem(key: string, value: any): void
	removeItem(key: string): void
}

let storage: Storage
{
	const sampleDate = new Date().toString()
	try {
		window.localStorage.setItem(sampleDate, sampleDate)
		window.localStorage.removeItem(sampleDate)
		storage = window.localStorage
	} catch (e) {
		console.error(e)
	}
}

export default {

	get (key: string, defaultValue: any = null) {
		if (storage) {
			const value = storage.getItem(key)
			if (value !== undefined && value !== 'null') {
				return value
			}
		}
		return defaultValue
	},

	getBool (key: string, defaultValue: boolean | null = null) {
		return this.get(key, defaultValue) == 'true'
	},

	set (key: string, value: any) {
		return storage && storage.setItem(key, value)
	},

	remove (key: string) {
		return storage && storage.removeItem(key)
	},

	getJSON (key: string) {
		const raw = this.get(key, null)
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

	setJSON (key: string, value: object | null) {
		return this.set(key, JSON.stringify(value))
	},

}
