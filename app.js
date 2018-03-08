const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const express = require('express')
const app = express()

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
	ffmpegPath: '/usr/bin/ffmpeg', // Where is the FFmpeg binary located?
	outputPath: 'track', // Where should the downloaded and encoded files be stored?
	youtubeVideoQuality: 'highest', // What video quality should be used?
	queueParallelism: 2, // How many parallel downloads/encodes should be started?
	progressTimeout: 2000 // How long should be the interval of the progress reports
})


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

app.get('/:videoID', (req, res) => {
  YD.download(req.params.videoID)
  YD.on('finished', function(err, data) {
    res.end(JSON.stringify(data))
  })

})



let videoId = '8RrQgG6RDkQ'






YD.on('error', function(error) {
	console.log(error)
})

YD.on('progress', function(progress) {
	console.log(JSON.stringify(progress))
})

let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Apollo API listening on port ${port} <3`))
