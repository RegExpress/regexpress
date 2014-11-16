var path = require('path');
var express = require('express');
var app = express();
var reloader = require('connect-livereload');

var port = 8000;

app.use(reloader());
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, '/client/index.html'));
 });

app.use(express.static(path.join(__dirname,'/client')));
console.log(__dirname);

app.listen(port, function(){
  console.log('listening on ' + port);
});
