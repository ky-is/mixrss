import Vue from 'vue'
//eslint-disable-next-line no-unused-vars
import { ActionTree, MutationTree, GetterTree } from 'vuex'

import fetchJsonp from 'fetch-jsonp'

import storage from '@/helpers/storage'
//eslint-disable-next-line no-unused-vars
import { FeedState } from '@/types/store'

//LOCAL

const YOUTUBE_API = 'AIzaSyCWalFG38MaNJ_aQdHmEG5aVurjfWlzOj4'

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
	result.push(padTime(seconds, true))
	return result.join(':')
}

//STATE

const state: FeedState = {
	url: storage.get('CURRENT_FEED_URL'),
	data: storage.getJSON('CURRENT_FEED_DATA'),
	modified: storage.getBool('CURRENT_FEED_MODIFIED', false),
}

//ACTIONS

const actions: ActionTree<FeedState, any> = {
	SET_FEED ({ commit }, feed) {
		commit('SET_CURRENT_FEED', feed)
		commit('CLEAR_PLAYBACK')
	},

	CREATE_FEED ({ commit, dispatch }, { title, author, icon }) {
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
		dispatch('SET_FEED', { url: null, data })
	},

	ADD_FEED_URL ({ dispatch }, url) {
		// const jsonpwrapper = `http://jsonpwrapper.com/?urls%5B%5D=${encodeURIComponent(url)}`
		const json2jsonp = `https://json2jsonp.com/?url=${encodeURIComponent(url)}`
		fetchJsonp(json2jsonp).then((response: any) => response.json())
		.then((data: JSONFeed) => {
			dispatch('SET_FEED', { url, data })
		})
		.catch((error: any) => {
			console.error(error)
		})
	},

	ADD_FEED_ITEM ({ commit, rootState }, url) {
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
				commit('PREPEND_TO_FEED', { localAuthor: rootState.author, url, title, duration, image })
				commit('SEEK_DIRECTION', 1)
			})
			.catch((error: any) => {
				console.error(error)
			})
		}
	},
}

//MUTATIONS

const mutations: MutationTree<FeedState> = {
	SONG_TITLE (state, { item, title }) {
		item.title = title
		storage.setJSON('CURRENT_FEED_DATA', state.data)
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
		const data = state.data
		if (data) {
			Vue.set(data, 'date_modified', new Date().toString())
			storage.setJSON('CURRENT_FEED_DATA', data)
		}
	},

	SONG_DESCRIPTION (state, { item, description }) {
		Vue.set(item, 'content_text', description)
		storage.setJSON('CURRENT_FEED_DATA', state.data)
	},

	SET_CURRENT_FEED (state, { url, data }) {
		state.url = url
		state.data = data
		storage.set('CURRENT_FEED_URL', url)
		storage.setJSON('CURRENT_FEED_DATA', data)
		storage.set('CURRENT_FEED_MODIFIED', false)
	},

	PREPEND_TO_FEED (state, { localAuthor, url, title, duration, image }) {
		const feedData = state.data
		if (!feedData) {
			return
		}
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
			_duration: duration,
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
	},

	CLEAR_FEED (state) {
		state.url = null
		state.data = null
		storage.remove('CURRENT_FEED_DATA')
		storage.remove('CURRENT_FEED_URL')
	},
}

//GETTERS

const getters: GetterTree<FeedState, any> = {
	songs (state): JSONFeedItem[] {
		const feedData = state.data
		return (feedData && feedData.items) || [] //TODO filter playable
	},
}

//EXPORT

export default {
	state,
	mutations,
	actions,
	getters,
}
