module.exports = function(http) {
    console.log("starting socket.io server");
    var numUsers = 0;

    var io = require('socket.io')(http);
    io.on('connection', function(socket) {

        var addedUser = false;

        socket.on('send message', function(data) {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('message', {
                username: socket.username,
                message: data
            });
        });

        socket.on('join', function(username) {
            if (addedUser) return;
            // we store the username in the socket session for this client
            socket.username = username;
            ++numUsers;
            addedUser = true;

            socket.emit('login', {
                users: numUsers,
                numUsers : numUsers
            });

            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            });
        });

        socket.on('typing', function() {
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });

        socket.on('stop typing', function() {
            socket.broadcast.emit('stop typing', {
                username: socket.username
            });
        });

        socket.on('disconnect', function() {
            if (addedUser) {
                --numUsers;
                socket.broadcast.emit('user left', {
                    username: socket.username,
                    numUsers: numUsers
                });
            }
        });
    });
}