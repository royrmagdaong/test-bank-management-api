const Student = require('../models/student')


module.exports = {
    getStudents: async (req, res) => {
        try {
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
                    full_name: {
                      $regex: '',
                      $options: "i",
                    }
                  },
                },
              ]).exec((error, students) => {
                if(error) return res.json({response: false, message: error.message})
                return res.json({response: true, data: students})
            })
        } catch (error) {
            return res.json({response: false, message: error.message})
        }
    }
}
