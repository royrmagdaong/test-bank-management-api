const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Activity = require('../models/activity')
const Professor = require('../models/professor')
const Class = require('../models/class')

module.exports = {
    getActivityCount: async (req, res) =>{
        try {
            let id = res.user.id
            await Professor.findOne({user_id:id}).exec(async(error, prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Activity.countDocuments({deleted_at: null, prof_id:prof._id}).exec(async (error, activityCount)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(activityCount){
                            return res.status(200).json({response:true, count: activityCount})
                        }else{
                            return res.status(200).json({response:true, count: 0})
                        }
                    })
                }else{
                    return res.status(403).json({response:false, message: 'Not allowed!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    },
    createActivity: async (req, res) => {
        try {
            let user_id = res.user.id
            let activityName = req.body.activityName
            let questions = req.body.questions

            await Professor.findOne({user_id:user_id}).exec(async (error, professor)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(professor){
                    await new Activity({
                        prof_id: professor._id,
                        activityName: activityName,
                        questions: questions
                    }).save(async (error,newActivity)=>{
                        if(error) return res.status(500).json({response:false, message: error.message})
                        if(newActivity){
                            return res.status(200).json({response:true, data: newActivity, message: 'Activity created successfully!'})
                        }else{
                            return res.status(500).json({response:false, message: 'Creation Failed!'})
                        }
                    })
                }else{
                    return res.status(500).json({response:false, message: 'Cannot find the user.'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    getProfActivities: async (req, res) => {
        try {
            let user_id = res.user.id
            await Professor.findOne({user_id: user_id}).exec(async (error, professor)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(professor){
                    await Activity.find({prof_id:professor._id,deleted_at:null}).exec(async (error,activities)=>{
                        if(error) return res.status(500).json({response:false, message: error.message})
                        return res.status(200).json({response:true, data: activities})
                    })
                }else{
                    return res.status(500).json({response:false, message: 'Cannot find the user.'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    getActivityById: async (req, res) => {
        try {
            let id = req.params.id
            let user_id = res.user.id
            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Activity.findOne({_id:id, prof_id:prof._id, deleted_at:null}).exec(async(error,activity)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(activity){
                            return res.status(200).json({response:true, data: activity})
                        }else{
                            return res.status(500).json({response:false, message:'Activity not found!'})
                        }
                    })
                }else{
                    return res.status(403).json({response:false, message:'Not authorized!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    },
    updateActivity: async (req, res) => {
        try {
            let user_id = res.user.id
            let activityName = req.body.activityName
            let activityId = req.body.activityId
            let questions = req.body.questions

            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Activity.findOne({_id:activityId, prof_id:prof._id, deleted_at:null}).exec(async(error,activity)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(activity){
                            activity.activityName = activityName
                            activity.questions = questions
                            activity.updated_at = Date.now()
                            await activity.save((error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Activity has been updated successfully!'})
                            })
                        }else{
                            return res.status(500).json({response:false, message:'Activity not found!'})
                        }
                    })
                }else{
                    return res.status(403).json({response:false, message:'Not authorized!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    },
    deleteActivity: async (req, res) => {
        try {
            let id = req.params.id 
            let user_id = res.user.id

            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Activity.findOne({_id:id, prof_id:prof._id, deleted_at:null}).exec(async(error,activity)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(activity){
                            activity.deleted_at = Date.now()
                            await activity.save((error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Activity has been deleted!'})
                            })
                        }else{
                            return res.status(500).json({response:false, message:'Activity not found!'})
                        }
                    })
                }else{
                    return res.status(403).json({response:false, message:'Not authorized!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    },
    assignActivityToClass: async (req, res) => {
        try {
            let class_id = req.body.class_id
            let activity_id = req.body.activity_id
            let user_id = res.user.id

            await Professor.findOne({user_id:user_id}).exec(async (error, prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Class.findOne({_id:class_id, instructor:prof._id}).exec(async(error, _class)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(_class){
                            _class.activity.push(activity_id)
                            _class.save(async(error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Activity successfully added to class.'})
                            })
                        }else{
                            return res.status(404).json({response:false, message:'Class not found!'})
                        }
                    })
                }else{
                    return res.status(403).json({response:false, message:'Not Allowed!'})
                }
            })

            
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    },
    getClassByProfActivity: async(req, res) => {
        try {
            let user_id = res.user.id
            let activity_id = req.body.activity_id
            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:true, message:error.message})
                if(prof){
                    await Class.aggregate([
                        {
                            $project:{
                                activity: 1,
                                class_code: 1,
                                instructor: 1,
                                section: 1,
                                disable:{
                                    $in:[ObjectId(activity_id), "$activity"]
                                }
                            }
                        },
                        {
                            $lookup:{ from: 'subjects', localField: 'class_code', foreignField: '_id', as: 'class_code' }
                        },
                        {   $unwind: "$class_code" },
                        {
                            $lookup:{ from: 'gradelevels', localField: 'section', foreignField: '_id', as: 'section' }
                        },
                        {   $unwind: "$section" },
                        {
                            $addFields: {
                                class_section: {
                                    $concat: ["$class_code.code", ' - ',"$section.grade_level", ' - ',"$section.section"],
                                }
                            },
                        },
                        {
                            $match: { 
                                instructor: prof._id
                            }
                        },
                        
                    ]).exec(async(error,classes)=>{
                        if(error) return res.status(500).json({response:true, message:error.message})
                        return res.status(200).json({response:true, data:classes})
                    })
                }else{
                    return res.status(403).json({response:true, message:'Not allowed!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:true, message:error.message})
        }
    },
    getAllClassByActivity: async (req,res) => {
        try {
            let activity_id = req.body.activity_id

            await Class.aggregate([
                {
                    $lookup:{ 
                        from: 'subjects', 
                        localField: 'class_code', 
                        foreignField: '_id', 
                        as: 'subject' 
                    }
                },
                {   $unwind: "$subject" },
                {
                    $lookup:{ 
                        from: 'gradelevels', 
                        localField: 'section', 
                        foreignField: '_id', 
                        as: 'section' 
                    }
                },
                {   $unwind: "$section" },
                {
                    $addFields: {
                        class_section: {
                            $concat: ["$subject.code", ' - ',"$section.grade_level", ' - ',"$section.section", ' (','$days_and_time',')'],
                        }
                    },
                },
                {
                    $project:{
                        class_section: 1,
                        activity: 1,
                        instructor: 1
                    }
                },
                {
                    $match: { activity: ObjectId(activity_id)  }
                }
            ]).exec(async(error,activity)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                return res.status(200).json({response:true, data: activity})
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    unAssignActivityToClass: async (req, res) => {
        try {
            let activity_id = req.body.activity_id
            let class_id = req.body.class_id
            await Class.findOne({_id:class_id}).exec(async (error, _class)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(_class){
                    const index = _class.activity.indexOf(activity_id)
                    if(index > -1){
                        _class.activity.splice(index, 1)
                    }
                    _class.save(async (error)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        return res.status(200).json({response: true, data: _class, message: 'Activity successfully unassigned to this class.'})
                    })
                }else{
                    return res.status(500).json({response:false, message: 'Class not found!'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    }
}
 