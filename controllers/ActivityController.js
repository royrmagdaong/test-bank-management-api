const Activity = require('../models/activity')
const Professor = require('../models/professor')

module.exports = {
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
                    await Activity.find({prof_id:professor._id}).exec(async (error,activities)=>{
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
                    await Activity.findOne({_id:id, prof_id:prof._id}).exec(async(error,activity)=>{
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
                    await Activity.findOne({_id:activityId, prof_id:prof._id}).exec(async(error,activity)=>{
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
    }
}
