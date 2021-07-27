const socket = io()
// elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message',(message)=>{
    console.log(message) 
    const html = Mustache.render(messageTemplate,{
        message
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