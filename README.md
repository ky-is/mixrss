# mixrss

Create, remix, and play [JSON Feed](https://jsonfeed.org) RSS playlists. It's a collaborative way to share and discover music. Try out a sample playlist: **https://mixrss.netlify.com?feeds=https://ky.is/music/sample.feed.json**

## Supported providers

Import and play songs from:
- SoundCloud
- YouTube

## Getting Started

mixrss is decentralized. It allows you to build a playlist feed, host it yourself, and then share it with others so they can play/remix it. This gives you ownership over your creation, delegating just the playback part to publicly-playable 3rd party services (listed above), which you can freely mix and match in a single playlist.

### Query parameters

- `feeds`: A comma-separated list of URLs pointing to JSON Feeds.
- `play`: The `id` of the song (same as its url by default) to autoplay on page load. This requires a feed to be specified in the `feeds` parameter.

Use these parameters to link directly to feeds you want to share!

## RSS

mixrss generates standard JSON Feed files, compatible with all modern RSS clients. As such, you can subscribe to a feed in your RSS reader to get notifications whenever a new song is added, and even play it inlinie via the embedded YouTube/SoundCloud player.

### Custom Fields

In addition to the JSON Feed spec, mixrss adds some custom fields for each object in the `items` array, with the standard `_` prefix:
- `_duration`: (HH:)mm:ss time string of the song duration.
- `_imageAlign`: Describes the CSS `background-position` that should be applied to the `image` url, to focus the album art in a non-square image (such as a widescreen YouTube video). The custom value `"youtube"` instead applies a custom class for YouTube's auto-generated song videos which have an off-center, zoomed out album cover image.

## Development

Set `VUE_APP_YOUTUBE_API` to your YouTube Data API v3 key from https://console.developers.google.com/apis/credentials. For local development, place it in an `.env` file at the project root.

```bash
cd mixrss
npm install
npm run serve
```
