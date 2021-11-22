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
                    {description: regexp}
                ] 
            });

            await GradeLevel.aggregate([
                {
                    $match: {
                    $or: [
                        {grade_level: regexp}, 
                        {description: regexp}
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
    }
}
