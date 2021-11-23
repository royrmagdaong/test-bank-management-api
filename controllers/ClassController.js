const Class = require('../models/class')

module.exports = {
    createClass: async (req, res) => {
        try {
            let index
            let class_code = req.body.class_code
            let instructor = req.body.instructor
            let days_and_time = req.body.days_and_time
            let room = req.body.room
            let section = req.body.section
            
            await Class.findOne({},{},{sort:{created_at: -1}}, async (error, lastRecord) => {
                if(error) return res.status(500).json({response: false, message: error.message})
                if(lastRecord){
                    index = lastRecord.index+1
                }else{
                    index = 1
                }
                await new Class({
                    index,
                    class_code,
                    instructor,
                    days_and_time,
                    room,
                    section
                }).save(async(error,newClass)=>{
                    if(error) return res.status(500).json({response: false, message: error.message})
                    return res.status(201).json({response: true, data: newClass})
                })
            })
        } catch (error) {
            return res.status(500).json({response: false, message:error.message})
        }
    }
}
