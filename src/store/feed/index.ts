import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'

import fetchJsonp from 'fetch-jsonp'

import { PLACEHOLDER_FEED_URL } from '@/helpers/constants'
import storage from '@/helpers/storage'

import importSoundCloud from '@/import/SoundCloud'
import importYouTube from '@/import/YouTube'

import { JSONFeed, JSONFeedAuthor, JSONFeedItem } from '@/types/jsonfeed'
import { FeedState, RootState } from '@/types/store'

//LOCAL

const jsonpUrls = [ 'https://jsonp.afeld.me/?url' ]
let jsonpUrl = jsonpUrls.pop()

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
	modified: storage.getBool('CURRENT_FEED_MODIFIED', false)!,
	selectedTagIds: [],
	loading: 0,
}

//ACTIONS

const actions: ActionTree<FeedState, any> = {
	SET_FEED ({ commit, dispatch, rootState }, urlAndData) {
		commit('SET_CURRENT_FEED', urlAndData)
		commit('WRITE_CURRENT_FEED', urlAndData)

		const pendingPlayUrl = rootState.playback.pendingUrl
		if (pendingPlayUrl) {
			dispatch('QUEUE_PLAY_URL', pendingPlayUrl)
		}
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

	LOAD_FEED_URL ({ commit, dispatch }, { url, adding }) {
		return new Promise((resolve, reject) => {
			commit('FEED_LOADING', 1)
			const jsonp = `${jsonpUrl}=${encodeURIComponent(url)}`
			fetchJsonp(jsonp).then((response: any) => response.json())
				.then((data: JSONFeed) => {
					if (adding || url === state.url) {
						dispatch('SET_FEED', { url, data })
					}
					resolve(url)
				})
				.catch((error: any) => {
					console.error(error)
					if (jsonpUrls.length) {
						jsonpUrl = jsonpUrls.pop()
						return dispatch('LOAD_FEED_URL', { url, adding })
					}
					reject(error)
				})
				.finally(() => {
					commit('FEED_LOADING', -1)
				})
		})
	},

	ADD_FEED_ITEM ({ commit, rootState }, url) {
		return new Promise((resolve, reject) => {
			if (importSoundCloud.isValid(url)) {
				importSoundCloud.load(url, (data: any) => {
					if (!data) {
						return reject()
					}
					data.localAuthor = rootState.author
					commit('PREPEND_TO_FEED', data)
					resolve()
				})
			} else {
				const youtubeId = importYouTube.getIdFrom(url)
				if (youtubeId) {
					importYouTube.load(youtubeId, (data: any) => {
						if (!data) {
							return reject()
						}
						data.localAuthor = rootState.author
						commit('PREPEND_TO_FEED', data)
						resolve()
					})
				}
			}
		})
	},

	REMOVE_FEED_ITEM ({ commit, dispatch, rootState }, id) {
		if (id === rootState.playback.id) {
			dispatch('SEEK_DIRECTION', 1)
		}
		commit('SONG_DELETE', id)
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
	FEED_LOADING (state, amount) {
		state.loading += amount
	},

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

	SONG_DELETE (state, id) {
		const feedData = state.data
		if (!feedData || !feedData.items) {
			return
		}
		feedData.items = feedData.items.filter(item => item.id !== id)
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
		if (url && !state.list.includes(url)) {
			state.list.unshift(url)
			storage.setJSON('FEED_LIST', state.list)
		}
	},

	UPDATE_FEED (state, { author, title, url, icon }) {
		if (state.data === null) {
			return
		}
		if (author) {
			if (!state.data.author) {
				state.data.author = {} as JSONFeedAuthor
			}
			state.data.author.name = author
		}
		state.data.title = title
		state.data.feed_url = url
		state.data.icon = icon
		writeFeedData(state)
	},

	PREPEND_TO_FEED (state, { localAuthor, type, id, permalink, title, duration, image, imageAlign, embed }) {
		const feedData = state.data
		if (!feedData) {
			return
		}
		const uniqueId = `${type}:${id}`
		const authorObject = localAuthor ? feedData.author : null
		const rawAuthor = authorObject ? authorObject.name : null
		const items = feedData.items || []
		if (!feedData.items) {
			Vue.set(feedData, 'items', items)
		}
		if (items.some(item => item.id === uniqueId)) {
			return window.alert('This song is already in your mix!')
		}
		const authorName = rawAuthor && localAuthor.toLowerCase() !== rawAuthor.toLowerCase() ? localAuthor : undefined
		const feedItem: JSONFeedItem = {
			id: uniqueId,
			external_url: permalink,
			content_html: `<iframe src="${embed}" width="100%"/>`,
			_duration: duration,
			summary: duration,
			title,
			image,
			_imageAlign: imageAlign,
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

const getters: GetterTree<FeedState, RootState> = {
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
				if (selectedTagIds.some(tagId => itemTagIds.includes(tagId))) {
					return true
				}
			} else if (selectedTagIds.includes('?')) {
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
