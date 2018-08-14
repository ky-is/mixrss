import fetchJsonp from 'fetch-jsonp'
import Vue from 'vue'

const YOUTUBE_API = 'AIzaSyCWalFG38MaNJ_aQdHmEG5aVurjfWlzOj4'

const TITLE_STRIP = [ 'official', 'official video', 'audio' ].map(t => `(\\[|\\()${t}(\\]|\\))`).join('|')
const TITLE_REGEX = new RegExp(TITLE_STRIP, 'ig')
const DURATION_REGEX = /PT(\d+H)?(\d+M)?(\d+S)?/

function padTime (string: string, hasLargerTime: boolean) {
	const number = parseInt(string.slice(0, -1), 10)
	return (hasLargerTime && number < 10 ? '0' : '') + number
}

function getDurationFromISO (duration: string) {
	const durations = DURATION_REGEX.exec(duration)
	if (!durations) {
		return ''
	}

	const [ _, hours, minutes, seconds ]: string[] = durations
	const result = []
	if (hours != null) {
		result.push(padTime(hours, !!result.length))
	}
	result.push(padTime(minutes || '0M', !!result.length))
	result.push(padTime(seconds || '0S', true))
	return result.join(':')
}

export default {

  load  (url: string, callback: Function) {
    const youtubeId = url.length === 11 ? url : Vue.prototype.$youtube.getIdFromUrl(url)
    if (!youtubeId) {
      return
    }
    const youtubeUrl =`https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${YOUTUBE_API}&part=snippet,contentDetails,status`
    fetchJsonp(youtubeUrl).then((response: any) => response.json())
    .then((data: any) => {
      data = data.items[0]
      // console.log(data) //SAMPLE
      if (!data || data.status.embeddable === false) {
        return window.alert(`Sorry, this video is not allowed to be played externally. Please use another version, or try finding a version on SoundCloud.`)
      }
      const regionRestriction = data.contentDetails.regionRestriction
      if (regionRestriction) {
        const description = regionRestriction.allowed ? 'only playable' : 'unplayable'
        const list = regionRestriction.allowed || regionRestriction.blocked
        const confirmed = window.confirm(`This video is ${description} in the following countries due to region restrictions:\n${list.join(', ')}.\nAdd anyway?`)
        if (!confirmed) {
          return
        }
      }
      const id = data.id
      const url = `https://www.youtube.com/watch?v=${id}`
      let title = data.snippet.title.replace(TITLE_REGEX, '').trim()
      const duration = getDurationFromISO(data.contentDetails.duration)
      const thumbnail = data.snippet.thumbnails.medium || data.snippet.thumbnails.default
      const image = thumbnail ? thumbnail.url : null
      const description = data.snippet.description
      const isAutogenerated = description.endsWith('\nAuto-generated by YouTube.')
      if (isAutogenerated && !title.includes(' - ')) {
        const channel = data.snippet.channelTitle
        const channelSplit = channel.split(' - Topic')
        if (channelSplit.length > 1) {
          title = `${channelSplit[0]} - ${title}`
        }
      }
      const imageAlign = isAutogenerated ? 'youtube' : undefined
      const embed = `https://www.youtube.com/embed/${id}`
      callback({ url, title, duration, image, imageAlign, embed })

    })
    .catch((error: any) => {
      console.error(error)
      window.alert('Unable to load from SoundCloud. Please check your URL and try again.')
    })
  },

}