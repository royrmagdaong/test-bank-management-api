const Class = require('../models/class')

module.exports = {
    getClasses: async (req, res) => {
        try {
            let searchString = req.body.searchString
            let limit = req.body.limit
            let skip = req.body.skip
            let regexp = new RegExp("^"+ searchString, 'i')
            let count

            await Class.aggregate([
                {
                    $lookup:{ from: 'subjects', localField: 'class_code', foreignField: '_id', as: 'class_code' }
                },
                {   $unwind: "$class_code" },
                {
                    $lookup:{ from: 'professors', localField: 'instructor', foreignField: '_id', as: 'instructor' }
                },
                {   $unwind: "$instructor" },
                {
                    $lookup:{ from: 'rooms', localField: 'room', foreignField: '_id', as: 'room' }
                },
                {   $unwind: "$room" },
                {
                    $lookup:{ from: 'gradelevels', localField: 'section', foreignField: '_id', as: 'section' }
                },
                {   $unwind: "$section" },
                {
                    $match: {
                        $or: [
                            {days_and_time: regexp},
                            { "section.grade_level": regexp },
                            { "section.section": regexp },
                            { "room.room": regexp },
                            { "instructor.first_name": regexp },
                            { "instructor.last_name": regexp },
                            { "class_code.code": regexp },
                            { "class_code.description": regexp },
                        ]
                    }
                },
                {
                    $group:{
                        _id: null,
                        count: {$sum:1}
                    }
                }
            ]).exec(async (error, classes) => {
                if(error) return res.json({response: false, message: error.message})
                if(classes.length>0){
                    count = classes[0].count
                }else{
                    count = 0
                }
                
                await Class.aggregate([
                    {
                        $lookup:{ from: 'subjects', localField: 'class_code', foreignField: '_id', as: 'class_code' }
                    },
                    {   $unwind: "$class_code" },
                    {
                        $lookup:{ from: 'professors', localField: 'instructor', foreignField: '_id', as: 'instructor' }
                    },
                    {   $unwind: "$instructor" },
                    {
                        $lookup:{ from: 'rooms', localField: 'room', foreignField: '_id', as: 'room' }
                    },
                    {   $unwind: "$room" },
                    {
                        $lookup:{ from: 'gradelevels', localField: 'section', foreignField: '_id', as: 'section' }
                    },
                    {   $unwind: "$section" },
                    {
                        $match: {
                            $or: [
                                {days_and_time: regexp},
                                { "section.grade_level": regexp },
                                { "section.section": regexp },
                                { "room.room": regexp },
                                { "instructor.first_name": regexp },
                                { "instructor.last_name": regexp },
                                { "class_code.code": regexp },
                                { "class_code.description": regexp },
                            ]
                        }
                    },
                    { $limit: limit + skip },
                    { $skip: skip }
                ]).exec(async (error, classes) => {
                    if(error) return res.json({response: false, message: error.message})
                    return res.json({
                        response: true, 
                        data: classes, 
                        count: count,
                        limit: limit,
                        skip: skip
                    })
                })
            })

        } catch (error) {
            res.status(500).json({response:false,message:error.message})
        }
    },
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
    },
    addStudent: async (req, res) => {
        try {
            let class_id = req.body.class_id
            let student_id = req.body.student_id

            await Class.findOne({_id: class_id}).exec((error,_class)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(_class){
                    student_id.forEach(id => {
                        _class.students.push(id)
                    });
                    _class.save(error=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                    })
                    return res.status(200).json({response:true, message:'Student added successfully!'})
                }else{
                    return res.status(404).json({response:false, message: 'Class not found.'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    },
    getStudents: async (req, res) => {
        try {
            let class_id = req.body.class_id
            await Class.findOne({_id: class_id})
            .populate('students')
            .exec((error, _class)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(_class){
                    return res.status(200).json({response:true, data: _class.students})
                }else{
                    return res.status(500).json({response:false, message: 'class not found.'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    getStudentSubjects: async (req, res) => {
        try {
            let student_id = req.body.student_id
            await Class.find({students: student_id})
            .populate(['class_code','instructor','room','section'])
            .exec((error,classes)=>{
                if(error) return res.status(500).json({response: true, message: error.message})
                if(classes){
                    return res.status(200).json({response:true, data: classes})
                }else{
                    return res.status(404).json({response: false, message: 'Nothing found!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response: true, message: error.message})
        }
    },
    getProfessorSubjects: async (req, res) => {
        try {
            let prof_id = req.body.prof_id
            await Class.find({instructor: prof_id})
            .populate(['class_code','room','section','students'])
            .exec((error,classes)=>{
                if(error) return res.status(500).json({response: true, message: error.message})
                if(classes){
                    return res.status(200).json({response:true, data: classes})
                }else{
                    return res.status(404).json({response: false, message: 'Nothing found!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response: true, message: error.message})
        }
    },
}
