(function(window, document, socket) {
    function announce(something) {
        var chats = document.getElementById('chats');
        chats.insertAdjacentHTML('beforeend', '<div class="chat-msg chat-msg--announcement">' + '<div class="message">' + something.replace("\n", '<br>') + '</div>' + '</div>');
        chats.scrollTop = chats.scrollHeight;
    }

    function updateOnlineCount(count) {
        document.getElementById("onlineCount").innerHTML = "" + count;
    }
    document.getElementById('btnSubmit').addEventListener('click', function() {
        var msgs = {};
        var message = document.getElementById('userMsg').value;

        if(!message)
            return;
        //send using socket.io 
        socket.emit('send message', message);
        var chats = document.getElementById('chats');
        chats.insertAdjacentHTML('beforeend', '<div class="chat-msg chat-msg--sent">' + '<div class="message">' + message.replace("\n", '<br>') + '</div>' + '</div>');
        chats.scrollTop = chats.scrollHeight;
    });
    var connected = false;
    var typing = false;
    socket.emit('join', chatter.username);
    socket.on('login', function(data) {
        connected = true;
        announce('Welcome to Chatter, '+ chatter.username + '!');
        updateOnlineCount(data.numUsers);
    });
    socket.on('message', function(data) {
        if (data.username == chatter.username) return;
        var chats = document.getElementById('chats');
        chats.insertAdjacentHTML('beforeend', '<div class="chat-msg chat-msg--received">' + '<div class="user">' + data.username + '</div>' + '<div class="message">' + data.message.replace("\n", '<br>') + '</div>' + '</div>');
        chats.scrollTop = chats.scrollHeight;
    });
    socket.on('user joined', function(data) {
        announce(data.username + ' joined the Chatter room');
        updateOnlineCount(data.numUsers);
    });
    socket.on('user left', function(data) {
        announce(data.username + ' left the Chatter room');
        updateOnlineCount(data.numUsers);
    });
})(window, document, io());