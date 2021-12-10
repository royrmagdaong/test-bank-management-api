const startExam = require('./events/startExam')
const joinExam = require('./events/joinExam')

module.exports = {
    initSocketIo: (io) => {
        io.on("connection", socket => {
            // register events
            startExam(socket,io)
            joinExam(socket,io)
        })
    }
} 