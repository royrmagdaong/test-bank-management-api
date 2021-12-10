const authenticate = require('../libs/authenticate')
const authRole = require('../libs/authRole')
let admin = 'admin'
let student = 'student'
let professor = 'professor'

module.exports = (socket,io) => {
    socket.on("join-class", data => {
        authenticate(data.token).then((user) =>{
            authRole(user,[professor]).then(()=>{
                io.emit("join-class-success", user)
                socket.join(data.room)
                console.log('joined', data.room)
            }).catch(error=>{
                io.emit("join-class-error", error)
            })
        }).catch((error) =>{
            io.emit("join-class-error", error)
        })
    })
}