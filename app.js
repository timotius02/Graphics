var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use("/", express.static(__dirname + '/app'));

io.on('connection', function (socket) {
  // listen for device move
  console.log('new user connected');
  socket.on('devicemove', function (data) {
  	console.log(data);
    socket.broadcast.emit('move', data);
  });
});

server.listen(3000, function(){
	console.log('listening on : 3000')
});

