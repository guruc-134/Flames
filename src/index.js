const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const  {generateMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
let message = 'Welcome !'
io.on('connection', (socket)=>{
    socket.emit('message',generateMessage("Welcome!"))
    socket.broadcast.emit('message',generateMessage('a new use has joined'))
    socket.on('sendMessage', (inp,callback)=>{
        const filter = new  Filter()
        if(filter.isProfane(inp))
        {
            return callback("Profanity is not allowed!")
        }
        io.emit('message',generateMessage(inp))
        callback('Delivered')
    })

    socket.on('sendLocation',({latitude,longitude},callback)=>{
        io.emit('locationMessage',`https://google.com/maps?q=${latitude},${longitude}`)
        callback()
    })
    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('User has left'))
    })
    
})
server.listen(port,()=>{
    console.log('server listening at port',port)
})
