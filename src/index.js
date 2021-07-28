const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const  {generateMessage, generateLocationMessage} = require('./utils/messages')
const {getUser,getUsersInRoom,removeUser,addUser} =require('./utils/users')
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
        socket.emit('message',generateMessage("Welcome!"))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`))
        callback()
    })
    socket.on('sendMessage', (inp,callback)=>{
        const filter = new  Filter()
        if(filter.isProfane(inp))
        {
            return callback("Profanity is not allowed!")
        }
        io.to().emit('message',generateMessage(inp))
        callback('Delivered')
    })

    socket.on('sendLocation',({latitude,longitude},callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user)
        {io.to(user.room).emit('message',generateMessage(`${user.username} has left`))}
    })
    
})
server.listen(port,()=>{
    console.log('server listening at port',port)
})
