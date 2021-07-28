//  here we are sending using socket as we want to send the new count only to this new socket,
    //  the old ones already have that count. so no need to do io.emit()
    socket.emit('countUpdated',count)
    //  server socket is listening to the increment events and broadcasting the countUpdated to all the sockets 
    //  that are present
    socket.on('increment',()=>{
        count ++;
        socket.emit('countUpdated',count) // this sends to the certain connection
        io.emit('countUpdated',count) // this emits to all the connections that are available
    })


    //  client socket is listening to the countUpdated event  from the server
socket.on('countUpdated',(count)=>{
    console.log('count has been updated',count)
})
//  the client socket is emitting the event increment everytime the button is being clicked
const btn = document.querySelector('#inc')
btn.addEventListener('click', ()=>{
    console.log('clicked')
    socket.emit('increment')
})








// socket.emit() to the targeted socket, 
// io.emit() to everyone connected
//  socket.broadcast.emit() to everyone but the targeted user 

// io.to.emit() send msg to everyone in that room
// socket.broadcast.to.emit() send msg to everyone in that room except that client 