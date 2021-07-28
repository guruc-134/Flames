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
}
const re = addUser({
    id:12,
    username:'guru',
    room:'12'
})
const re1 = addUser({
    id:121,
    username:'guru123',
    room:'12'
})

removeUser(121)
console.log(users)