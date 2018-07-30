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

app.get('/:track/:artist/:duration', (req, res) => {
	youtubeSearch('AIzaSyD_uZJQ7E74CoN5D48t8mldAKGUPx9XQ9Y', {
		q: `${req.params.track.replace(
			/[^\w\s]/gi,
			''
		)} ${req.params.artist.replace(/[^\w\s]/gi, '')} audio`
	})
		.then(results => {
			const setUrl = url => {
				res.send(url)
			}
			let videoUrl
			for (item of results.items) {
				let videoId = item.id.videoId
				ytdl.getInfo(
					`https://www.youtube.com/watch?v=${videoId}`,
					(err, info) => {
						let format = info.formats.find(item =>
							item.type.includes('codecs="avc1')
						)
						if (
							format &&
							parseInt(info.length_seconds) >=
								parseInt(req.params.duration) - 30 &&
							parseInt(info.length_seconds) <=
								parseInt(req.params.duration) + 30
						) {
							//res.send(format.url)
							if (!videoUrl) {
								setUrl(format.url)
							}
							videoUrl = format.url
						}
					}
				)
			}
		})
		.catch(err => console.log(`Youtube search failed: ${err}`))
})

// Backwards compat

app.get('/:track/:artist', (req, res) => {
	youtubeSearch('AIzaSyD_uZJQ7E74CoN5D48t8mldAKGUPx9XQ9Y', {
		q: `${req.params.track.replace(
			/[^\w\s]/gi,
			''
		)} ${req.params.artist.replace(/[^\w\s]/gi, '')} audio`
	})
		.then(results => {
			let videoId = results.items[0].id.videoId

			ytdl.getInfo(
				`https://www.youtube.com/watch?v=${videoId}`,
				(err, info) => {
					console.log('ok')
					console.log(info)
					let format = info.formats.find(item =>
						item.type.includes('audio')
					)
					if (format) {
						res.send(format.url)
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
	res.send('Welcome to the Euterpe API <3')
})

let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Euterpe API listening on port ${port} <3`))
