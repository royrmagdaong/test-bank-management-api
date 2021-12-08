const Exam = require('../models/exam')
const Professor = require('../models/professor')

module.exports = {
    getExamCount: async (req, res) =>{
        try {
            let id = res.user.id
            await Professor.findOne({user_id:id}).exec(async(error, prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Exam.countDocuments({deleted_at: null, prof_id:prof._id}).exec(async (error, examCount)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(examCount){
                            return res.status(200).json({response:true, count: examCount})
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
    createExam: async (req, res) => {
        try {
            let user_id = res.user.id
            let examName = req.body.examName
            let questions = req.body.questions

            await Professor.findOne({user_id:user_id}).exec(async (error, professor)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(professor){
                    await new Exam({
                        prof_id: professor._id,
                        examName: examName,
                        questions: questions
                    }).save(async (error,newExam)=>{
                        if(error) return res.status(500).json({response:false, message: error.message})
                        if(newExam){
                            return res.status(200).json({response:true, data: newExam, message: 'Exam created successfully!'})
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
    getProfExams: async (req, res) => {
        try {
            let user_id = res.user.id
            await Professor.findOne({user_id: user_id}).exec(async (error, professor)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(professor){
                    await Exam.find({prof_id:professor._id,deleted_at:null}).exec(async (error,exams)=>{
                        if(error) return res.status(500).json({response:false, message: error.message})
                        return res.status(200).json({response:true, data: exams})
                    })
                }else{
                    return res.status(500).json({response:false, message: 'Cannot find the user.'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    getExamById: async (req, res) => {
        try {
            let id = req.params.id
            let user_id = res.user.id
            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Exam.findOne({_id:id, prof_id:prof._id, deleted_at:null}).exec(async(error,exam)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(exam){
                            return res.status(200).json({response:true, data: exam})
                        }else{
                            return res.status(500).json({response:false, message:'Exam not found!'})
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
    updateExam: async (req, res) => {
        try {
            let user_id = res.user.id
            let examName = req.body.examName
            let examId = req.body.examId
            let questions = req.body.questions

            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Exam.findOne({_id:examId, prof_id:prof._id, deleted_at:null}).exec(async(error,exam)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(exam){
                            exam.examName = examName
                            exam.questions = questions
                            exam.updated_at = Date.now()
                            await exam.save((error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Exam has been updated successfully!'})
                            })
                        }else{
                            return res.status(500).json({response:false, message:'Exam not found!'})
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
    deleteExam: async (req, res) => {
        try {
            let id = req.params.id 
            let user_id = res.user.id

            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Exam.findOne({_id:id, prof_id:prof._id, deleted_at:null}).exec(async(error,exam)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(exam){
                            exam.deleted_at = Date.now()
                            await exam.save((error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Exam has been deleted!'})
                            })
                        }else{
                            return res.status(500).json({response:false, message:'Exam not found!'})
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
