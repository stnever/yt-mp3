var fs = require('fs'),
	mkdirp = require('mkdirp'),
	YT2MP3 = require('./yt2mp3'),
  ffmpeg = require('fluent-ffmpeg')
  
var ffmpegPath = 'C:\\data\\tools\\ffmpeg-20170601-bd1179e-win64-static\\bin'
ffmpeg.setFfmpegPath(ffmpegPath + '\\ffmpeg.exe')
ffmpeg.setFfprobePath(ffmpegPath + '\\ffprobe.exe') 

function isUrl(str) {
  return str != null && str.trim().length > 0 && !str.trim().startsWith('#')
}

var outputDir = __dirname + '/output'

var input = fs.readFileSync(__dirname + '/input.txt', 'utf-8').split('\n').filter(l => isUrl(l))

input.forEach(url => {
  var downloader = new YT2MP3(outputDir)
   
  downloader
    .download(url)
    .on('download'	, title => console.log('Download: ' + title))
    .on('converted'	, title => console.log('Converted: ' + title))
    .on('error'		  , err	=> console.log(err.stack))
})
