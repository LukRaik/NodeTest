var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/server/index.html');
});
io.on('connection', function (socket) {
    socket.broadcast.emit('chat message', 'someone connected');
    socket.emit('chat message', "Hello in chat, nick:{nickname} to change your nickname");
    console.log(socket.username + ':a user connected');
    socket.on('typing-start', function () {
        socket.broadcast.emit('typing-start', socket.username);
    });
    socket.on('typing-stop', function () {
        socket.broadcast.emit('typing-stop', socket.username);
    });
    socket.on('chat message', function (msg) {
        if (msg.indexOf("nick:") > -1) {
            console.log(socket.username + " seting to " + msg.split('nick:')[1]);
            socket.broadcast.emit('chat message', socket.username + " changed username to " + msg.split('nick:')[1]);
            socket.username = msg.split('nick:')[1];
            socket.emit('chat message', "Username set to: " + socket.username);
        }
        else {
            console.log(socket.username + ":" + msg);
            socket.broadcast.emit('chat message', socket.username + ":" + msg);
        }
    });
    socket.on('disconnect', function () {
        io.emit('chat message', 'someone disconnected');
        console.log('disconnected');
    });
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
