const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 4500;

const users = {};

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hell its working");
});

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
    console.log("New connection");

    socket.on('join-room', ({ room, user }) => {
        socket.join(room);
        users[socket.id] = user; // Associate user with socket ID
        io.to(room).emit('welcome', { user: "Admin", message: `let's have a chat in Room, ${room}!` });
        console.log(`User ${user} joined room ${room}`);
    });

    socket.on('message', ({ message, room }) => {
        if (room) {
            io.to(room).emit('sendMessage', { user: users[socket.id], message, id: socket.id });
        } else {
            socket.emit('sendMessage', { user: 'Admin', message: 'Room not specified', id: socket.id });
        }
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('leave', { user: 'Admin', message: `${users[socket.id]} has left` });
            console.log(`User ${users[socket.id]} left`);
            delete users[socket.id];
        }
    });

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has joined` });
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${users[socket.id]}` });
    });

});


server.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
