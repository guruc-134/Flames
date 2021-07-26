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

io.on('connection', ()=>{
console.log('new web socket connection')
})
server.listen(port,()=>{
    console.log('server listening at port',port)
})
