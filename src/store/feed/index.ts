import Vue from 'vue'
//eslint-disable-next-line no-unused-vars
import { ActionTree, MutationTree, GetterTree } from 'vuex'

import fetchJsonp from 'fetch-jsonp'

import { PLACEHOLDER_FEED_URL } from '@/helpers/constants'
import storage from '@/helpers/storage'

//eslint-disable-next-line no-unused-vars
import { FeedState } from '@/types/store'

//LOCAL

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

const currentFeed: string | null = storage.get('CURRENT_FEED_URL')

function feedKey (url: string | null): string {
	return url || 'LOCAL_FEED'
}

function writeFeedData (state: FeedState) {
	storage.setJSON(feedKey(state.url), state.data)
}

function getLocalFeed (url: string | null): JSONFeed | null {
	return storage.getJSON(feedKey(url))
}

//STATE

const state: FeedState = {
	list: storage.getJSON('FEED_LIST') || [],
	url: currentFeed,
	data: getLocalFeed(currentFeed),
	modified: storage.getBool('CURRENT_FEED_MODIFIED', false),
	selectedTagIds: [],
}

//ACTIONS

const actions: ActionTree<FeedState, any> = {
	SET_FEED ({ commit }, urlAndData) {
		commit('SET_CURRENT_FEED', urlAndData)
		commit('WRITE_CURRENT_FEED', urlAndData)
	},

	SET_FEED_BY_URL ({ state, commit, dispatch }, url) {
		commit('TOGGLE_ADD_FEED', false)
		if (url !== state.url) {
			const data = getLocalFeed(url)
			commit('SET_CURRENT_FEED', { url, data })
		}
		if (url) {
			dispatch('LOAD_FEED_URL', { url })
		}
	},

	CREATE_LOCAL_FEED ({ commit, dispatch, rootState }) {
		const data: JSONFeed = {
			version: 'https://jsonfeed.org/version/1',
			feed_url: PLACEHOLDER_FEED_URL,
			title: '',
			icon: '',
			author: {
				name: rootState.local.author,
			},
			items: [],
		}
		dispatch('SET_FEED', { url: null, data })
		commit('TOGGLE_ADD_FEED', false)
	},

	LOAD_FEED_URL ({ dispatch }, { url, adding }) {
		return new Promise((resolve, reject) => {
			// const jsonpwrapper = `http://jsonpwrapper.com/?urls%5B%5D=${encodeURIComponent(url)}`
			const json2jsonp = `https://json2jsonp.com/?url=${encodeURIComponent(url)}`
			fetchJsonp(json2jsonp).then((response: any) => response.json())
			.then((data: JSONFeed) => {
				if (adding || url === state.url) {
					dispatch('SET_FEED', { url, data })
				}
				resolve(url)
			})
			.catch((error: any) => {
				console.error(error)
				reject(error)
			})
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
				const title = video.snippet.title.replace(TITLE_REGEX, '').trim()
				const duration = getDurationFromISO(video.contentDetails.duration)
				const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default
				const image = thumbnail ? thumbnail.url : null
				commit('PREPEND_TO_FEED', { localAuthor: rootState.author, url, title, duration, image })
			})
			.catch((error: any) => {
				console.error(error)
			})
		}
	},

	DELETE_FEED ({ commit }, url) {
		commit('REMOVE_FEED', url)
		if (state.url === url) {
			let newUrl = null
			let data: JSONFeed | null = null
			if (url) {
				data = getLocalFeed(null)
			}
			if (data === null) {
				for (const listUrl of state.list) {
					data = getLocalFeed(listUrl)
					if (data) {
						newUrl = listUrl
						break
					}
				}
			}
			commit('SET_CURRENT_FEED', { url: newUrl, data })
		}
	},
}

//MUTATIONS

const mutations: MutationTree<FeedState> = {
	SONG_TITLE (state, { item, title }) {
		item.title = title
		writeFeedData(state)
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
			Vue.set(data, 'date_modified', new Date().toISOString())
			writeFeedData(state)
		}
	},

	SONG_DESCRIPTION (state, { item, description }) {
		Vue.set(item, 'content_text', description)
		writeFeedData(state)
	},

	SET_CURRENT_FEED (state, { url, data }) {
		state.url = url
		state.data = data
		state.selectedTagIds = []
		storage.set('CURRENT_FEED_URL', url)
		storage.set('CURRENT_FEED_MODIFIED', false)
	},

	WRITE_CURRENT_FEED (state, { url }) {
		writeFeedData(state)
		if (url && state.list.indexOf(url) === -1) {
			state.list.unshift(url)
			storage.setJSON('FEED_LIST', state.list)
		}
	},

	UPDATE_FEED (state, { title, url }) {
		if (state.data === null) {
			return
		}
		state.data.title = title
		state.data.feed_url = url
		writeFeedData(state)
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
			date_published: new Date().toISOString(),
		}
		if (authorName) {
			const feedAuthor: JSONFeedAuthor = { name: authorName }
			feedItem.author = feedAuthor
		}
		items.unshift(feedItem)
		writeFeedData(state)
		storage.set('CURRENT_FEED_MODIFIED', true)
	},

	CLEAR_FEED (state) {
		state.url = null
		state.data = null
		storage.remove('CURRENT_FEED_URL')
	},

	TOGGLE_TAG_ID (state, tagId) {
		const tagIndex = state.selectedTagIds.indexOf(tagId)
		if (tagIndex === -1) {
			state.selectedTagIds.push(tagId)
		} else {
			state.selectedTagIds.splice(tagIndex, 1)
		}
	},

	CLEAR_TAGS (state) {
		state.selectedTagIds = []
	},

	REMOVE_FEED (state, url) {
		storage.remove(feedKey(url))
		if (url) {
			const index = state.list.indexOf(url)
			if (index !== -1) {
				state.list.splice(index, 1)
				storage.setJSON('FEED_LIST', state.list)
			}
		}
	},
}

//GETTERS

const getters: GetterTree<FeedState, any> = {
	feedForUrl: () => getLocalFeed,

	songs (state): JSONFeedItem[] {
		const feedData = state.data
		const items = feedData && feedData.items
		if (!items) {
			return []
		}
		const selectedTagIds = state.selectedTagIds
		if (!selectedTagIds.length) {
			return items
		}
		return items.filter(item => {
			const itemTags = item.tags
			if (itemTags && itemTags.length) {
				const itemTagIds = itemTags.map(tag => tag.toLowerCase())
				for (const filterTagId of selectedTagIds) {
					if (itemTagIds.indexOf(filterTagId) !== -1) {
						return true
					}
				}
			} else if (selectedTagIds.indexOf('?') !== -1) {
				return true
			}
			return false
		})
	},
}

//EXPORT

export default {
	state,
	mutations,
	actions,
	getters,
}
