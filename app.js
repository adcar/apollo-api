const ytdl = require('ytdl-core')
const express = require('express')
const app = express()
const youtubeSearch = require('youtube-api-v3-search')

// CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})

app.get('/:track/:artist', (req, res) => {
	youtubeSearch('AIzaSyD_uZJQ7E74CoN5D48t8mldAKGUPx9XQ9Y', {
		q: `${req.params.track} by ${req.params.artist} audio`
	})
		.then(results => {
			let videoId = results.items[0].id.videoId
			ytdl.getInfo(
				`https://www.youtube.com/watch?v=${videoId}`,
				(err, info) => {
					if (
						info.formats.find(
							item => item.type === 'audio/webm; codecs="vorbis"'
						)
					) {
						res.text(
							info.formats.find(
								item => item.type === 'audio/webm; codecs="vorbis"'
							).url
						)
					} else {
						console.log(`Youtube getInfo failed: ${err}`)
						res.send('Song not found')
					}
				}
			)
		})
		.catch(err => console.log(`Youtube search failed: ${err}`))
})

app.get('/', (req, res) => {
	res.send('Welcome to the Apollo API <3')
})

let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Apollo API listening on port ${port} <3`))
