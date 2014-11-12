var path = require('path');
var express = require('express');
var server = express();


var port = 8000;

server.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, '/client/index.html'));
 });

server.use(express.static(path.join(__dirname,'/client')));
console.log(__dirname);

server.listen(port, function(){
  console.log('listening on ' + port);
});
