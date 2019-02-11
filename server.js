 var path= require('path');
var bodyparser= require('body-parser');
// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var server=require('./Server/app');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv'); 

// create a new express server
var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
//app.use('/', admin);
app.use('/server',server)


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/dist'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'/dist/index.html'));
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});