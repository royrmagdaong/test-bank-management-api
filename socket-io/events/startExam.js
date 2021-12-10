const moment = require('moment')
const authenticate = require('../libs/authenticate')
const authRole = require('../libs/authRole')
const Activity = require('../../models/activity')
let professor = 'professor'

module.exports = (socket,io) => {
    socket.on("start-exam", (room,data) =>{
        authenticate(data.token).then((user) =>{
            authRole(user,[professor]).then(()=>{
                Activity.findOne({_id:room}).exec( async (error,activity) => {
                    if(error) io.sockets.in(room).emit("start-exam-error", error)
                    if(activity){
                        let hours_minutes = parseFloat(activity.time_duration.hours_minutes)
                        let duration_in = activity.time_duration.duration_in
                        
                        var eventTime = moment().add(hours_minutes, duration_in).valueOf()
                        var currentTime = moment().valueOf()
                        var diffTime = eventTime - currentTime;
                        var duration2 = moment.duration(diffTime, 'milliseconds');

                        let examCountDown = setInterval(()=>{
                            let countdown = duration2.hours()+ ':' + duration2.minutes() + ':' + duration2.seconds()
                            // socket.to(room).emit("exam-timer", timer) // to everyone in the class except the sender
                            // io.sockets.in(room).emit('exam-timer', timer); // to everyone including the sender
                            io.sockets.in(room).emit(room, countdown);

                            duration2 = moment.duration(duration2 - 1000, 'milliseconds');
                            console.log(countdown)
                            if(countdown==='0:0:0'){
                                console.log('submit exam')
                                clearInterval(examCountDown)

                                activity.is_done = true
                                activity.in_progress = false
                                activity.save(async error =>{
                                    if(error) io.sockets.in(room).emit("start-exam-error", error)
                                    io.sockets.in(room).emit("start-exam-success", 'Times up!')
                                })
                            }
                        }, 1000)
                    }else{
                        io.sockets.in(room).emit("start-exam-error", 'Activity not found')
                    }
                })
            })
        })
    })
}
