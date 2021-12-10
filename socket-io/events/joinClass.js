const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate')
module.exports = (socket,io) => {
    socket.on("join-class", data => {
        authenticate(data.token).then( (user) =>{
            io.emit("join-class-success", user)
            socket.join(data.room)
            console.log('joined', data.room)
        }).catch( (error) =>{
            io.emit("join-class-error", error)
        })
    })
}