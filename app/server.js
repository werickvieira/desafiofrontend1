var express = require('express');
//var path    = require('path');
var app     = express();

//app.use("/assets", express.static(__dirname + '/assets'));
app.use("/", express.static(__dirname + '/')); 

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});

app.listen(3000);