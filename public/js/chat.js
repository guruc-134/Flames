const socket = io()
socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    var inp = e.target.elements.message.value
    socket.emit('sendMessage',inp)
})

//  sending client location
document.querySelector('#send-location').addEventListener('click',()=>{
    if( !navigator.geolocation)
    {
        return alert('geolocation not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log('location is being sent',position)
        socket.emit('sendLocation',{
            longitude: position.coords.longitude,
            latitude:position.coords.latitude
        })
    })
})