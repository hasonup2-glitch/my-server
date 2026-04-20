const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// هذه السطر مهم جداً عشان الصور والملفات تظهر
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

    socket.on('message', (msg) => {
        io.emit('createMessage', { msg: msg, user: socket.username });
    });

    socket.on('disconnect', () => {
        users = users.filter(u => u !== socket.username);
        io.emit('update-users', users);
    });
});

http.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});