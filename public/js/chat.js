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
const sidebarTemplate = document.querySelector('#sidebar-content-template').innerHTML
const roomsListTemplate = document.querySelector('#rooms-list-template')
//  options 
const {username,room,roomType} = Qs.parse(location.search,{ignoreQueryPrefix:true})
const getUser =(users,id)=>{
    const user = users.find(user => user.id === id)
    if(!user) return undefined
    return user.username
}

const autoScroll = ()=>{
    // New message element
    const  $newMessage = $messages.lastElementChild
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // visible Height
    const visibleHeight = $messages.offsetHeight
    // height of messages container 
    const containerHeight = $messages.scrollHeight
    // how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight
    if(containerHeight - newMessageHeight <= scrollOffset)
    {
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on('message',(message)=>{
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()

})
socket.on('locationMessage',(location)=>{
    const html = Mustache.render(locationMessageTemplate,{
        username:location.username,
        location:location.location,
        createdAt:moment(location.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()

})
socket.on('roomData',({room, users,publicRooms})=>{
    const curUser = getUser(users,socket.id)
    const html = Mustache.render(sidebarTemplate,{room,users,publicRooms,curUser})
    document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join',{username,room,roomType},(error)=>{
    if(error)
    {
        alert(error)
        location.href = '/ '
    }
})