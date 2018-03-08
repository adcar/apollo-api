const express = require('express')
const app = express()
const fs = require('fs');
const ytdl = require('ytdl-core');



// CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})


app.use('/track', express.static('track'))

app.get('/', (req, res) => {
  res.send('Welcome to Apollo')
})


app.get('/:videoId', (req, res) => {
  let stream = ytdl(`https://www.youtube.com/watch?v=${req.params.videoId}`, { filter: 'audioonly' })

  // Pipe the stream to this video file
  stream.pipe(fs.createWriteStream(`./track/${req.params.videoId}.webm`))

  // As soon as piping starts, redirect to the video file
  stream.on('pipe', () => {res.redirect(`./track/${req.params.videoId}.webm`)})
})


let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Apollo API listening on port ${port} <3`))
