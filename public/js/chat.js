const socket = io()
// elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//  options 
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
socket.on('message',(message)=>{
    const html = Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

})
socket.on('locationMessage',(location)=>{
    const html = Mustache.render(locationMessageTemplate,{
        location:location.location,
        createdAt:moment(location.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    var inp = e.target.elements.message.value
    socket.emit('sendMessage',inp,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if(error)
        {
            return console.log(error)
        }
        console.log('the message was delivered')
    })
})

//  sending client location
$sendLocationBtn.addEventListener('click',()=>{
    if( !navigator.geolocation)
    {
        return alert('geolocation not supported by your browser')
    }
    $sendLocationBtn.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',
        {
            longitude: position.coords.longitude,
            latitude:position.coords.latitude
        },()=>{
            $sendLocationBtn.removeAttribute('disabled')
            console.log('location is shared')
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href = '/'
    }
})