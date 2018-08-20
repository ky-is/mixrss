import fetchJsonp from 'fetch-jsonp'

import soundcloudIds from '@/helpers/soundcloud_ids'

function getDurationFromMS (duration: number) {
	let seconds = Math.round(duration / 1000)
	const minutes = Math.floor(seconds / 60)
	seconds %= 60
	const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
	return `${minutes}:${secondsString}`
}

export default {

	isValid (url: string): boolean {
		return url.toLowerCase().includes('soundcloud.com')
	},

	load (url: string, callback: Function, retry?: boolean) {
		const soundcloudId = soundcloudIds.next()
		const soundcloudApi = `https://api.soundcloud.com/resolve?url=${url}&client_id=${soundcloudId}`
		fetchJsonp(soundcloudApi).then((response: any) => response.json())
			.then((data: any) => {
				// console.log(data) //SAMPLE
				if (data.embeddable_by !== 'all') {
					return window.alert(`Sorry, this track is not allowed to be played externally (restricted to ${data.embeddable_by}). Please use another song, or try finding a version on YouTube.`)
				}

				const permalink = data.permalink_url
				let title = data.title
				const user = data.user
				if (user) {
					title = `${user.username} - ${title}`
				}
				const duration = getDurationFromMS(data.duration)
				const image = data.artwork_url
				const embed = `https://w.soundcloud.com/player/?url=${data.uri}`
				const id = data.id
				callback({ type:'sc', id, permalink, title, duration, image, embed })
			})
			.catch((error: any) => {
				if (!retry) {
					this.load(url, callback, true)
				} else {
					callback()
					console.error(error)
					window.alert('Unable to load from SoundCloud. Please check your URL and try again.')
				}
			})
	},

}
