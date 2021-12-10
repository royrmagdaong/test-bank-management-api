const startExam = require('./events/startExam')
const joinClass = require('./events/joinClass')
module.exports = {
    initSocketIo: (io) => {
        io.on("connection", socket => {
            // register events
            startExam(socket,io)
            joinClass(socket,io)
        })
    }
} 