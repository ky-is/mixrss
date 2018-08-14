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

  load (url: string, callback: Function, retry?: boolean) {
    const soundcloudId = soundcloudIds.next()
    const soundcloudUrl = `https://api.soundcloud.com/resolve?url=${url}&client_id=${soundcloudId}`
    fetchJsonp(soundcloudUrl).then((response: any) => response.json())
    .then((data: any) => {
      console.log(data)
      if (data.embeddable_by !== 'all') {
        return window.alert(`Sorry, this track is not allowed to be played externally (restricted to ${data.embeddable_by}). Please use another song, or try finding a version on YouTube.`)
      }
      const id = data.id
      const url = data.permalink_url
      const title = data.title
      const duration = getDurationFromMS(data.duration)
      const image = data.artwork_url
      callback({ type: 'soundcloud', id, url, title, duration, image })
    })
    .catch((error: any) => {
      if (!retry) {
        this.load(url, callback, true)
      } else {
        console.error(error)
        window.alert('Unable to load from SoundCloud. Please check your URL and try again.')
      }
    })
  },

}
