const Module = require('../models/module')
const Professor = require('../models/professor')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    uploadModule: async (req, res) => {
        try {
            let prof_id = res.user.id
            let subj_id = req.body.subj_id
            let moduleName = req.body.moduleName
            let originalFileName = req.file.originalname
            let mimetype = req.file.mimetype
            let filename = req.file.filename
            let path = req.file.path

            module_ = new Module({
                prof_id: prof_id,
                subj_id: subj_id,
                moduleName: moduleName,
                originalFileName: originalFileName,
                mimetype: mimetype,
                filename: filename,
                path: path
            })

            await module_.save((error, newModule_) => {
                if(error) return res.json({response: false, message: error.message})
                if(newModule_){
                    return res.json({response: true, message: 'Module Uploaded successfully.'})
                }
            })
        } catch (error) {
            return res.json({response: false, message: error.message})
        }
    },
    getModules: async (req, res) => {
        try {

            // await Module.find({prof_id:prof_id}).exec((error, modules) => {
            //     if(error) return res.status(500).json({response: false, message: error.message})
            //     return res.status(200).json({response: true, data: modules})
            // })
            let user_id = res.user.id
            await Professor.findOne({user_id: user_id}).exec(async (error, professor)=>{
                if(error) return res.status(500).json({response:false, message: error.message})
                if(professor){
                    await Module.aggregate([
                        {
                            $lookup:{ 
                                from: 'classes', 
                                localField: 'subj_id', 
                                foreignField: '_id', 
                                as: 'class' 
                            }
                        },
                        {   $unwind: "$class" },
                        {
                            $lookup:{ 
                                from: 'gradelevels', 
                                localField: 'class.section', 
                                foreignField: '_id', 
                                as: 'section' 
                            }
                        },
                        {   $unwind: "$section" },
                        {
                            $lookup:{ 
                                from: 'subjects', 
                                localField: 'class.class_code', 
                                foreignField: '_id', 
                                as: 'subject' 
                            }
                        },
                        {   $unwind: "$subject" },
                        {
                            $addFields: {
                                class_name: {
                                    $concat: ["$section.grade_level", "$section.section", ' - ', '$subject.code', ' ', '$subject.description']
                                }
                            },
                        },
                        {
                            $match: {  
                                $and:[
                                    {prof_id: ObjectId(professor.user_id)},
                                    {deleted_at:null},
                                ]
                            }
                        }
                    ])
                    .exec(async (error,modules)=>{
                        if(error) return res.status(500).json({response:false, message: error.message})
                        return res.status(200).json({response:true, data: modules})
                    })
                }else{
                    return res.status(500).json({response:false, message: 'Cannot find the user.'})
                }
            })
        } catch (error) {
            return res.json({response: false, message: error.message})
        }
    },
    getModuleCount: async (req, res) =>{
        try {
            let id = res.user.id
            await Professor.findOne({user_id:id}).exec(async(error, prof)=>{
                if(error) return res.status(500).json({response:false, message:error.message})
                if(prof){
                    await Module.countDocuments({deleted_at: null, prof_id:id}).exec(async (error, moduleCount)=>{
                        if(error) return res.status(500).json({response:false, message:error.message})
                        if(moduleCount){
                            return res.status(200).json({response:true, count: moduleCount})
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
}
