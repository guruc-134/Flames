const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
let message = 'Welcome !'
io.on('connection', (socket)=>{
    // welcome msg to that socket
    socket.emit('message',message)
    // notification msg to all but that socket
    socket.broadcast.emit('message','a new use has joined')
    //  listening to the sendMessage event
    socket.on('sendMessage', (inp)=>{
        // updating/ sending that msg to all the clients on that socket
        io.emit('message',inp)
    })

    socket.on('sendLocation',({latitude,longitude})=>{
        io.emit('message',`https://google.com/maps?q=${latitude},${longitude}`)
    })
    socket.on('disconnect',()=>{
        io.emit('message','User has left')
    })
    
})
server.listen(port,()=>{
    console.log('server listening at port',port)
})
