var express = require('express');
var http = require('http');
var fs = require("fs");
var querystring = require('querystring');
var request = require('request');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/image', function(req, res) {
  
    var post_data = {
      'imageFile' : fs.createReadStream('file.jpg')
	  };

    var options = {
      url: 'http://api.emovu.com/api/image',
      formData: post_data,
      headers: {
          'LicenseKey':'[key]'
      }
    };
    

    request.post(options, function optionalCallback(err, httpResponse, body) {
      if (err) {
        res.send(err);
        return console.error('upload failed:', err);
      }
      console.log('Upload successful!  Server responded with:', body);
      res.send(body);
    });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


