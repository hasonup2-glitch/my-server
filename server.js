const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let users = [];

io.on('connection', (socket) => {
    socket.on('join-server', (username) => {
        socket.username = username;
        users.push(username);
        io.emit('update-users', users);
    });

    socket.on('audio-stream', (data) => {
        socket.broadcast.emit('audio-stream', data);
    });

    socket.on('message', (msg) => {
        io.emit('createMessage', { msg: msg, user: socket.username });
    });

    socket.on('disconnect', () => {
        users = users.filter(u => u !== socket.username);
        io.emit('update-users', users);
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
