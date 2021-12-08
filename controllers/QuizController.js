const Quiz = require('../models/quiz')
const Professor = require('../models/professor')

module.exports = {
    getQuizCount: async (req, res) =>{
        try {
            let id = res.user.id
            await Professor.findOne({user_id:id}).exec(async(error, prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Quiz.countDocuments({deleted_at: null, prof_id:prof._id}).exec(async (error, quizCount)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(quizCount){
                            return res.status(200).json({response:true, count: quizCount})
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
    createQuiz: async (req, res) => {
        try {
            let user_id = res.user.id
            let quizName = req.body.quizName
            let questions = req.body.questions

            await Professor.findOne({user_id:user_id}).exec(async (error, professor)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(professor){
                    await new Quiz({
                        prof_id: professor._id,
                        quizName: quizName,
                        questions: questions
                    }).save(async (error,newQuiz)=>{
                        if(error) return res.status(500).json({response:false, message: error.message})
                        if(newQuiz){
                            return res.status(200).json({response:true, data: newQuiz, message: 'Quiz created successfully!'})
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
    getProfQuizzes: async (req, res) => {
        try {
            let user_id = res.user.id
            await Professor.findOne({user_id: user_id}).exec(async (error, professor)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(professor){
                    await Quiz.find({prof_id:professor._id,deleted_at:null}).exec(async (error,quizzes)=>{
                        if(error) return res.status(500).json({response:false, message: error.message})
                        return res.status(200).json({response:true, data: quizzes})
                    })
                }else{
                    return res.status(500).json({response:false, message: 'Cannot find the user.'})
                }
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    getQuizById: async (req, res) => {
        try {
            let id = req.params.id
            let user_id = res.user.id
            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Quiz.findOne({_id:id, prof_id:prof._id, deleted_at:null}).exec(async(error,quiz)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(quiz){
                            return res.status(200).json({response:true, data: quiz})
                        }else{
                            return res.status(500).json({response:false, message:'Quiz not found!'})
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
    updateQuiz: async (req, res) => {
        try {
            let user_id = res.user.id
            let quizName = req.body.quizName
            let quizId = req.body.quizId
            let questions = req.body.questions

            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Quiz.findOne({_id:quizId, prof_id:prof._id, deleted_at:null}).exec(async(error,quiz)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(quiz){
                            quiz.quizName = quizName
                            quiz.questions = questions
                            quiz.updated_at = Date.now()
                            await quiz.save((error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Quiz has been updated successfully!'})
                            })
                        }else{
                            return res.status(500).json({response:false, message:'Quiz not found!'})
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
    deleteQuiz: async (req, res) => {
        try {
            let id = req.params.id 
            let user_id = res.user.id

            await Professor.findOne({user_id:user_id}).exec(async (error,prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Quiz.findOne({_id:id, prof_id:prof._id, deleted_at:null}).exec(async(error,quiz)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(quiz){
                            quiz.deleted_at = Date.now()
                            await quiz.save((error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Quiz has been deleted!'})
                            })
                        }else{
                            return res.status(500).json({response:false, message:'Quiz not found!'})
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
