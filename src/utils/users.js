const users = []
//  addUser,  removeUser , getUser, getUsersInRoom

const addUser = ({id, username, room})=>
{
    //  Clean the data
    username=username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //  validate the data
    if (!username || !room)
    {
        return {
            error:"User and room are required"
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
    const user = {id,username,room}
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

const getUsersInRoom = (room) =>{
    room = room.trim().toLowerCase()
    const roomUsers = users.filter(user => user.room === room)
    if(!roomUsers) return []
    return roomUsers
}

module.exports = {getUser,getUsersInRoom,removeUser,addUser}