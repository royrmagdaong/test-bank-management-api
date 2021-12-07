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
    }
}
