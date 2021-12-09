const mongoose = require('mongoose')
const Quiz = require('../models/quiz')
const Professor = require('../models/professor')
const Class = require('../models/class')
const ObjectId = mongoose.Types.ObjectId;

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
    },
    assignClass: async (req, res) => {
        try {
            let class_id = req.body.class_id
            let quiz_id = req.body.quiz_id
            let user_id = res.user.id

            await Professor.findOne({user_id:user_id}).exec(async (error, prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Class.findOne({_id:class_id, instructor:prof._id}).exec(async(error, _class)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(_class){
                            _class.quiz.push(quiz_id)
                            _class.save(async(error)=>{
                                if(error) return res.status(500).json({response:false, message:error.message})
                                return res.status(200).json({response:true, message: 'Quiz successfully added to class.'})
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
    getAllClass: async (req,res) => {
        try {
            let quiz_id = req.body.quiz_id

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
                        quiz: 1,
                        instructor: 1
                    }
                },
                {
                    $match: { quiz: ObjectId(quiz_id)  }
                }
            ]).exec(async(error,quiz)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                return res.status(200).json({response:true, data: quiz})
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    unAssignClass: async (req, res) => {
        try {
            let quiz_id = req.body.quiz_id
            let class_id = req.body.class_id
            await Class.findOne({_id:class_id}).exec(async (error, _class)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(_class){
                    const index = _class.quiz.indexOf(quiz_id)
                    if(index > -1){
                        _class.quiz.splice(index, 1)
                    }
                    _class.save(async (error)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        return res.status(200).json({response: true, data: _class, message: 'Quiz successfully unassigned to this class.'})
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
