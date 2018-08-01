import Vue from 'vue'
import Vuex from 'vuex'

import fetchJsonp from 'fetch-jsonp'

import storage from '@/helpers/storage'

Vue.use(Vuex)

const YOUTUBE_API = 'AIzaSyCWalFG38MaNJ_aQdHmEG5aVurjfWlzOj4'

const DURATION_REGEX = /PT(\d+H)?(\d+M)?(\d+S)?/

//SAMPLE
// const feed = storage.getJSON('CURRENT_FEED_DATA')
// console.log(feed)
// const duration = feed.items[0].content_text
// console.log(duration, Date.parse(duration), getDurationFromISO(duration))

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
	result.push(padTime(seconds, true))
	return result.join(':')
}

interface RootState {
	author: string
	playback: {
		index: number | null
		paused: boolean
	}
	currentFeed: {
		url: string | null
		data: JSONFeed | null
		modified: boolean
	}
}

export default new Vuex.Store<RootState>({

	strict: process.env.NODE_ENV !== 'production',

	state: {
		author: storage.get('AUTHOR'),

		playback: {
			index: null,
			paused: false,
		},

		currentFeed: {
			url: storage.get('CURRENT_FEED_URL'),
			data: storage.getJSON('CURRENT_FEED_DATA'),
			modified: storage.getBool('CURRENT_FEED_MODIFIED', false),
		},
	},

	actions: {
		CREATE_FEED ({ commit }, { title, author, icon }) {
			const data: JSONFeed = {
				version: 'https://jsonfeed.org/version/1',
				feed_url: 'SET_TO_THE_URL_WHERE_YOU_UPLOAD_THIS_FEED',
				icon,
				title,
				author: {
					name: author,
				},
				items: [],
			}
			if (author) {
				commit('SET_AUTHOR', author)
			}
			commit('SET_CURRENT_FEED', { url: null, data })
		},

		ADD_FEED_URL ({ commit }, url) {
			// const jsonpwrapper = `http://jsonpwrapper.com/?urls%5B%5D=${encodeURIComponent(url)}`
			const json2jsonp = `https://json2jsonp.com/?url=${encodeURIComponent(url)}`
			fetchJsonp(json2jsonp).then((response: any) => response.json())
			.then((data: JSONFeed) => {
				commit('SET_CURRENT_FEED', { url, data })
			})
			.catch((error: any) => {
				console.error(error)
			})
		},

		ADD_FEED_ITEM ({ commit }, url) {
			const youtubeId = url.length === 11 ? url : Vue.prototype.$youtube.getIdFromUrl(url) //TODO
			if (youtubeId) {
				const youtubeUrl =`https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${YOUTUBE_API}&part=snippet,contentDetails,status`
				fetchJsonp(youtubeUrl).then((response: any) => response.json())
				.then((data: any) => {
					const video = data.items[0]
					if (!video) {
						return window.alert('No video found for that URL. Please check the video link/id you copied and try again, thanks!')
					}
					const url = `https://www.youtube.com/watch?v=${youtubeId}`
					const title = video.snippet.title
					const duration = getDurationFromISO(video.contentDetails.duration)
					const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default
					const image = thumbnail ? thumbnail.url : null
					commit('PREPEND_TO_FEED', { url, title, duration, image })
				})
				.catch((error: any) => {
					console.error(error)
				})
			}
		},
	},

	mutations: {
		SONG_SET (state, index) {
			if (index === state.playback.index) {
				state.playback.paused = !state.playback.paused
			} else {
				state.playback.index = index
			}
		},

		SONG_TOGGLE (state) {
			if (state.playback.index === null) {
				state.playback.index = 0
			} else {
				state.playback.paused = !state.playback.paused
			}
		},

		SONG_SEEK (state, direction) {
			state.playback.index += direction
		},

		SONG_TITLE (state, { item, title }) {
			item.title = title
			storage.setJSON('CURRENT_FEED_DATA', state.currentFeed.data)
		},

		SONG_TAG (state, { item, tag, add }) {
			let tags = item.tags
			if (!tags) {
				tags = []
				if (add) {
					tags.push(tag)
				}
				Vue.set(item, 'tags', tags)
			} else {
				const lowercaseTag = tag.toLowerCase()
				for (let idx = tags.length - 1; idx >= 0; idx -= 1) {
					const checkTag = tags[idx]
					if (lowercaseTag === checkTag.toLowerCase()) {
						if (add) {
							return
						}
						tags.splice(idx, 1)
					}
				}
				if (add) {
					tags.push(tag)
				}
			}
			const data = state.currentFeed.data
			if (data) {
				Vue.set(data, 'date_modified', new Date().toString())
				storage.setJSON('CURRENT_FEED_DATA', data)
			}
		},

		SONG_DESCRIPTION (state, { item, description }) {
			Vue.set(item, 'content_text', description)
			storage.setJSON('CURRENT_FEED_DATA', state.currentFeed.data)
		},

		SET_CURRENT_FEED (state, { url, data }) {
			state.playback.index = null
			state.playback.paused = false
			state.currentFeed.url = url
			state.currentFeed.data = data
			storage.set('CURRENT_FEED_URL', url)
			storage.setJSON('CURRENT_FEED_DATA', data)
			storage.set('CURRENT_FEED_MODIFIED', false)
		},

		PREPEND_TO_FEED (state, { url, title, duration, image }) {
			const feedData = state.currentFeed.data
			if (!feedData) {
				return
			}
			const localAuthor = state.author
			const authorObject = localAuthor ? feedData.author : null
			const rawAuthor = authorObject ? authorObject.name : null
			const items = feedData.items || []
			if (!feedData.items) {
				Vue.set(feedData, 'items', items)
			}
			for (const item of items) {
				if (item.url === url || item.external_url === url) {
					return window.alert('This song is already in your playlist!')
				}
			}
			const authorName = rawAuthor && localAuthor.toLowerCase() !== rawAuthor.toLowerCase() ? localAuthor : undefined
			const feedItem: JSONFeedItem = {
				id: url,
				external_url: url,
				duration,
				summary: duration,
				title,
				image,
				date_published: new Date().toString(),
			}
			if (authorName) {
				const feedAuthor: JSONFeedAuthor = { name: authorName }
				feedItem.author = feedAuthor
			}
			items.unshift(feedItem)
			storage.setJSON('CURRENT_FEED_DATA', feedData)
			storage.set('CURRENT_FEED_MODIFIED', true)
			if (state.playback.index !== null) {
				state.playback.index += 1
			}
		},

		CLEAR_FEED (state) {
			state.playback.index = null
			state.currentFeed.url = null
			state.currentFeed.data = null
			storage.remove('CURRENT_FEED_DATA')
			storage.remove('CURRENT_FEED_URL')
		},

		SET_AUTHOR (state, author) {
			state.author = author
			storage.set('AUTHOR', author)
		},
	},

	getters: {
		songs (state) {
			const feedData = state.currentFeed.data
			if (!feedData) {
				return []
			}
			return feedData.items //TODO filter playable
		},
	},

})
