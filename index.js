var express = require('express');
var http = require('http');
var fs = require("fs");
var querystring = require('querystring');
var request = require('request');
var multer    =   require( 'multer' );
var upload    =   multer( { dest: 'uploads/' } );
var sizeOf    =   require( 'image-size' );
var exphbs    =   require( 'express-handlebars' );
require( 'string.prototype.startswith' );


var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(express.static( __dirname + '/bower_components' ) );

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } );
  }

  var dimensions = sizeOf( req.file.path );

  if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
    return res.status( 422 ).json( {
      error : 'The image must be at least 640 x 480px'
    } );
  }

    var post_data = {
      'imageFile' : fs.createReadStream(req.file.path)
    };

    var options = {
      url: 'http://api.emovu.com/api/image',
      formData: post_data,
      headers: {
          'LicenseKey':''
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
    

  //return res.status( 200 ).send( req.file );
});

app.get('/image', function(req, res) {
  
    var post_data = {
      'imageFile' : fs.createReadStream('file.jpg')
	  };

    var options = {
      url: 'http://api.emovu.com/api/image',
      formData: post_data,
      headers: {
          'LicenseKey':''
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


