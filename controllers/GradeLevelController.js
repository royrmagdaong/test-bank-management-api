const GradeLevel = require('../models/grade-level')

module.exports = {
    getGradeLevels: async (req, res) => {
        try {
            let searchString = req.body.searchString
            let limit = req.body.limit
            let skip = req.body.skip
            let regexp = new RegExp("^"+ searchString, 'i')

            const count = await GradeLevel.countDocuments({ 
                $or: [
                    {grade_level: regexp}, 
                    {description: regexp},
                    {section: regexp}
                ] 
            });

            await GradeLevel.aggregate([
                {
                    $addFields: {
                    grade_and_section: {
                        $concat: ["$grade_level", ' - ',"$section"],
                    }
                    },
                },
                {
                    $match: {
                    $or: [
                        {grade_level: regexp}, 
                        {description: regexp},
                        {section: regexp}
                    ]
                    }
                },
                { $limit: limit + skip },
                { $skip: skip }
                ]).exec((error, grade_level) => {
                if(error) return res.json({response: false, message: error.message})
                return res.json({
                    response: true, 
                    data: grade_level, 
                    count: count,
                    limit: limit,
                    skip: skip
                })
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    createGradeLevel: async (req, res) => {
        try {
            let index
            let description = req.body.description
            let grade_level = req.body.grade_level
            let section = req.body.section
            
            await GradeLevel.findOne({},{},{sort:{created_at: -1}}, async (error, lastRecord) => {
                if(error) return res.status(500).json({response: false, message: error.message})
                index = lastRecord.index+1
                await new GradeLevel({
                    index,
                    description,
                    grade_level,
                    section
                }).save(async(error,newGradeLevel)=>{
                    if(error) return res.status(500).json({response: false, message: error.message})
                    return res.status(201).json({response: true, data: newGradeLevel})
                })
            })
        } catch (error) {
            return res.status(500).json({response: false, message:error.message})
        }
    }
}
