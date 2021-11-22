const Subject = require('../models/subject')

module.exports = {
    getSubjects: async(req,res) => {
        try {
            let searchString = req.body.searchString
            let limit = req.body.limit
            let skip = req.body.skip
            let regexp = new RegExp("^"+ searchString, 'i')
  
            const count = await Subject.countDocuments({ 
                $or: [
                    {code: regexp}, 
                    {description: regexp}, 
                    {grade_level: regexp}
                ]
            });
  
            await Subject.aggregate([
                {
                  $match: {
                    $or: [
                        {code: regexp}, 
                        {description: regexp}, 
                        {grade_level: regexp}
                    ]
                  }
                },
                { $limit: limit + skip },
                { $skip: skip }
              ]).exec((error, subjects) => {
                if(error) return res.json({response: false, message: error.message})
                return res.json({
                  response: true, 
                  data: subjects, 
                  count: count,
                  limit: limit,
                  skip: skip
                })
            })
          } catch (error) {
              return res.json({response: false, message: error.message})
          }
    },
    createSubject: async (req, res) => {
        try {
            let index
            let code = req.body.code
            let description = req.body.description
            let grade_level = req.body.grade_level
            
            await Subject.findOne({},{},{sort:{created_at: -1}}, async (error, lastRecord) => {
                if(error) return res.status(500).json({response: false, message: error.message})
                index = lastRecord.index+1
                await new Subject({
                    index,
                    code,
                    description,
                    grade_level
                }).save(async(error,newSubj)=>{
                    if(error) return res.status(500).json({response: false, message: error.message})
                    return res.status(201).json({response: true, data: newSubj})
                })
            })
        } catch (error) {
            return res.json({response: false, message: error.message})
        }
    }
}
