import Vue from 'vue'
import Vuex from 'vuex'

import fetchJsonp from 'fetch-jsonp'
import getYoutubeId from 'get-youtube-id'

import storage from '@/helpers/storage'

Vue.use(Vuex)

const YOUTUBE_API = 'AIzaSyCWalFG38MaNJ_aQdHmEG5aVurjfWlzOj4'

const DURATION_REGEX = /PT(\d+H)?(\d+M)?(\d+S)?/

//SAMPLE
// const feed = storage.getJSON('CURRENT_FEED_DATA')
// const duration = feed.items[0].content_text
// console.log(duration, Date.parse(duration), getDurationFromISO(duration))

function padTime (string, hasLargerTime) {
	const number = parseInt(string.slice(0, -1), 10)
	return (hasLargerTime && number < 10 ? '0' : '') + number
}

function getDurationFromISO (duration) {
	const [ _, hours, minutes, seconds ] = DURATION_REGEX.exec(duration)
	const result = []
	if (hours != null) {
		result.push(padTime(hours, result.length))
	}
	result.push(padTime(minutes || '0M', result.length))
	result.push(padTime(seconds, true))
	return result.join(':')
}

export default new Vuex.Store({

	strict: process.env.NODE_ENV !== 'production',

	state: {
		author: storage.get('AUTHOR'),

		currentFeed: {
			url: storage.get('CURRENT_FEED_URL'),
			data: storage.getJSON('CURRENT_FEED_DATA'),
		},
	},

	actions: {
		ADD_FEED_URL ({ commit }, url) {
			// const jsonpwrapper = `http://jsonpwrapper.com/?urls%5B%5D=${encodeURIComponent(url)}`
			const json2jsonp = `https://json2jsonp.com/?url=${encodeURIComponent(url)}`
			fetchJsonp(json2jsonp).then(response => response.json())
			.then(data => {
				commit('SET_CURRENT_FEED', { url, data })
			})
			.catch(error => {
				console.error(error)
			})
		},

		ADD_FEED_ITEM ({ commit }, url) {
			const youtubeId = url.length === 11 ? url : getYoutubeId(url)
			if (youtubeId) {
				const youtubeUrl =`https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${YOUTUBE_API}&part=snippet,contentDetails,status`
				fetchJsonp(youtubeUrl).then(response => response.json())
				.then(data => {
					const video = data.items[0]
					if (!video) {
						return window.alert('No video found for that URL. Please check the video link/id you copied and try again, thanks!')
					}
					// console.log(video)
					const url = video.snippet.url
					const title = video.snippet.title
					const duration = getDurationFromISO(video.contentDetails.duration)
					const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default
					const image = thumbnail ? thumbnail.url : null
					commit('PREPEND_TO_FEED', { url, title, duration, image })
				})
				.catch(error => {
					console.error(error)
				})
			}
		},
	},

	mutations: {
		SET_CURRENT_FEED (state, { url, data }) {
			state.currentFeed.url = url
			state.currentFeed.data = data
			storage.set('CURRENT_FEED_URL', url)
			storage.setJSON('CURRENT_FEED_DATA', data)
		},

		PREPEND_TO_FEED (state, { url, title, duration, image }) {
			const feedData = state.currentFeed.data
			let feedAuthor = state.author && feedData.author
			if (feedAuthor && feedAuthor.name) {
				feedAuthor = feedAuthor.name
			}
			const items = feedData.items
			for (const item of items) {
				if (item.url === url || item.external_url === url) {
					return window.alert('This song is already in your playlist!')
				}
			}
			const setAuthor = feedAuthor && state.author.toLowercase() !== feedAuthor.toLowercase() ? state.author : undefined
			items.unshift({
				id: url,
				external_url: url,
				duration,
				summary: duration,
				title,
				image,
				author: setAuthor,
				date_published: new Date(),
			})
			storage.setJSON('CURRENT_FEED_DATA', feedData)
		},
	},

	getters: {

	},

})
