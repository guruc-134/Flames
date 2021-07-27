const socket = io()
socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    var inp = e.target.elements.message.value
    socket.emit('sendMessage',inp,(error)=>{
        if(error)
        {
            return console.log(error)
        }
        console.log('the message was delivered')
    })
})

//  sending client location
document.querySelector('#send-location').addEventListener('click',()=>{
    if( !navigator.geolocation)
    {
        return alert('geolocation not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            longitude: position.coords.longitude,
            latitude:position.coords.latitude
        },()=>{
            console.log('location is shared')
        })
    })
})