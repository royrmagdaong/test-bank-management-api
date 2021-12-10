const moment = require('moment')
module.exports = (socket,io) => {
    socket.on("start-exam", (room, duration) =>{
        let timer = duration

        var eventTime = moment().add(2, 'hours').valueOf()
        var currentTime = moment().valueOf()
        var diffTime = eventTime - currentTime;
        var duration2 = moment.duration(diffTime, 'milliseconds');
        
        // async way
        setTimeout(()=>{
            let examCountDown = setInterval(()=>{
                let countdown = duration2.hours()+ ':' + duration2.minutes() + ':' + duration2.seconds()
                // socket.to(room).emit("exam-timer", timer) // to everyone in the class except the sender
                // io.sockets.in(room).emit('exam-timer', timer); // to everyone including the sender
                io.sockets.in(room).emit('exam-timer', countdown); // to everyone including the sender
                // console.log(timer)
                timer--
                duration2 = moment.duration(duration2 - 1000, 'milliseconds');
                console.log(countdown)
                if(timer<0){
                    console.log('submit exam')
                    clearInterval(examCountDown)
                }
            }, 1000)
        },1000)
    })
}
