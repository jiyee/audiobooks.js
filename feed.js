'use strict';

var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    RSS = require('rss');

app.set('port', process.env.PORT || 8088);
app.set('audiobooks_dir', process.env.AUDIOBOOKS_DIR || __dirname + '/audiobooks');

app.use('/audiobooks', express.static(app.get('audiobooks_dir')));

var getFileUrl = function(req, file) {
  return req.protocol + "://" + req.get('host') + '/audiobooks/' + file;
};

var getFilePath = function(file) {
  return app.get('audiobooks_dir') + '/' + file;
};

app.get('/', function(req, res) {
  fs.readdir(app.get('audiobooks_dir'), function(err, files) {
    var feed = new RSS({
      title: 'Jiyee\'s Audiobooks',
      generator: 'Jiyee Sheng',
      image_url: 'https://pbs.twimg.com/profile_images/288253590/1562770942_400x400.jpg'
    });

    files.forEach(function(file) {
      if(path.extname(file) === '.mp3') {
        feed.item({
          title: path.basename(file, '.mp3'),
          url: getFileUrl(req, file),
          enclosure: {
            url: getFileUrl(req, file),
            file: getFilePath(file),
          },
          date: fs.statSync(getFilePath(file)).mtime,
        });
      }
    });

    var xml = feed.xml({indent: '  '});
    res.send(xml);
  });
})

app.listen(app.get('port'));
