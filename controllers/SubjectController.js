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
    }
}
