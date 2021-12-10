const authenticate = require('../libs/authenticate')
const authRole = require('../libs/authRole')
let professor = 'professor'

module.exports = (socket,io) => {
    socket.on("join-exam", data => {
        authenticate(data.token).then((user) =>{
            authRole(user,[professor]).then(()=>{
                // io.emit("join-class-success", user)
                socket.join(data.room)
                console.log('joined', data.room)
            }).catch(error=>{
                io.sockets.in(data.room).emit("join-exam-error", error)
            })
        }).catch((error) =>{
            io.sockets.in(data.room).emit("join-exam-error", error)
        })
    })
}