const users = []
var rooms = []
//  addUser,  removeUser , getUser, getUsersInRoom, getAllPublic rooms

const addUser = ({id, username, room, roomType})=>
{
    //  Clean the data
    if(username)
    username=username.trim().toLowerCase()
    else return {error:"invalid details"}
    if(room)
    room = room.trim().toLowerCase()
    else return {error:"invalid details"}
    if(roomType)
    roomType = roomType.trim().toLowerCase()
    else return {error:"invalid details"}
    //  validate the data
    if (!username || !room)
    {
        return {
            error:"User and room are required"
        }
    }
    //  add room to rooms list
    const existing = rooms.filter(item=>item.room === room)
    if(existing.length === 0)
    {
        rooms.push({room,roomType})
    }
    const sameRoomDifferentType = rooms.filter(item=>item.room === room && item.roomType !== roomType)
    if(sameRoomDifferentType.length>0)
    {
        return {
            error:'room type not compatible'
        }
    }
    //  check for existing user 
    const existingUser = users.find(user =>{
        return user.room === room && user.username === username
    })

    // validate userName 
    if(existingUser)
    {
        return{
            error:'Username is already taken'
        }
    }
    // storing user 
    const user = {id,username,room,roomType}
    users.push(user)
    return {user}
}

const removeUser =(id)=>{
    const ind = users.findIndex(user =>user.id === id)
    if(ind!=-1)
    {
        return users.splice(ind,1)[0]
    }
    return undefined
}

const getUser =(id)=>{
    const user = users.find(user => user.id === id)
    if(!user) return undefined
    return user
}

const getUsersInRoom = (room,roomType) =>{
    room = room.trim().toLowerCase()
    const roomUsers = users.filter(user => user.room === room && user.roomType === roomType)
    if(!roomUsers) return []
    roomUsers.sort()
    return roomUsers
}

const getAllPublicRooms = () =>{
    const list = rooms.filter(room =>room.roomType === 'public')
    list.sort()
    return list
}

const removeRoom = (room) =>{
    rooms = rooms.filter(item=> item.room != room)
}
module.exports = {getUser,getUsersInRoom,removeUser,addUser,getAllPublicRooms,removeRoom}