const ytdl = require('ytdl-core'),
      EventEmitter = require('events'),
      mkdirp = require('mkdirp'),
      ffmpeg = require('fluent-ffmpeg'),
      _ = require('lodash')

class YT2MP3 extends EventEmitter {
  constructor(outputDir) {
    super()
    this.outputDir = outputDir
    mkdirp.sync(outputDir)
  }
  
  saveAndConvert(title, stream, bitrate) {
    var kebab = _.chain(title).deburr().kebabCase().value()
    
    console.log('deburred', kebab)
    new ffmpeg(stream)
      .audioBitrate(bitrate)
      .saveToFile(this.outputDir + '/' + kebab + '.mp3')
      .on('error', err => this.emit('error', err))
      .on('end', () => this.emit('converted', title))
  }
  
  download(ytId) {
    
    let url = ytId.startsWith('http') ? ytId : 'https://www.youtube.com/watch?v=' + ytId

    let stream = ytdl(url, {
      quality: 'highest',
      downloadURL: true,
      filter: 'audioonly'
    })
    
    stream
      .on('info', (info, format) => {
        this.emit('download', info.title)
        this.saveAndConvert(info.title, stream, 192)
      })
      .on('error', err => this.emit('error', err))
    
    return this
  }  
}

module.exports = YT2MP3