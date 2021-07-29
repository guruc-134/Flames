const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const  {generateMessage, generateLocationMessage} = require('./utils/messages')
const {getUser,getUsersInRoom,removeUser,addUser,removeRoom,getAllPublicRooms} =require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
io.on('connection', (socket)=>{
    socket.on('join',(options,callback)=>{
        const {error,user} = addUser({id:socket.id,...options})
        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)
        const username = "admin"
        socket.emit('message',{username,...generateMessage('Welcome!')})
        socket.broadcast.to(user.room).emit('message',{username,...generateMessage(`${user.username} has joined`)})
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room,user.roomType),publicRooms:getAllPublicRooms()})
        callback()
    })
    socket.on('sendMessage', (inp,callback)=>{
        const user = getUser(socket.id)
        const filter = new  Filter()
        if(filter.isProfane(inp))
        {
            return callback("Profanity is not allowed!")
        }
        const username = user.username
        io.to(user.room).emit('message',{username,...generateMessage(inp)})
        callback('Delivered !')
    })

    socket.on('sendLocation',({latitude,longitude},callback)=>{
        const user = getUser(socket.id)
        const username = user.username
        io.to(user.room).emit('locationMessage',{username,...generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`)})
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        const username = 'admin'
        if(user)
        {
            io.to(user.room).emit('message',{username,...generateMessage(`${user.username} has left`)})
            const existingUsers = getUsersInRoom(user.room,user.roomType)
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:existingUsers,
                publicRooms:getAllPublicRooms()
            })

            if (existingUsers.length == 0)
            {
                removeRoom(user.room)
            }
        }
    })
    
})
server.listen(port,()=>{
    console.log('server listening at port',port)
})
