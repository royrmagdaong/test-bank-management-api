const Student = require('../models/student')


module.exports = {
    getStudents: async (req, res) => {
        try {
          let searchString = req.body.searchString
          let limit = req.body.limit
          let skip = req.body.skip
          let regexp = new RegExp("^"+ searchString, 'i')

          const count = await Student.countDocuments({ $or: [
            {student_id: regexp}, 
            {first_name: regexp}, 
            {middle_name: regexp}, 
            {last_name: regexp}] 
          });

          await Student.aggregate([
              {
                $addFields: {
                  full_name: {
                    $concat: ["$first_name", ' ',"$middle_name", ' ',"$last_name"],
                  }
                },
              },
              {
                $match: {
                  $or: [
                    {student_id:regexp},
                    {first_name:regexp},
                    {middle_name:regexp},
                    {last_name:regexp},
                  ]
                }
              },
              { $limit: limit + skip },
              { $skip: skip }
            ]).exec((error, students) => {
              if(error) return res.json({response: false, message: error.message})
              return res.json({
                response: true, 
                data: students, 
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
