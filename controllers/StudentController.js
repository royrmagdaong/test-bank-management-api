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
    },
    createStudent: async (req, res) => {
      try {
        let student_id
        let first_name = req.body.first_name
        let middle_name = req.body.middle_name
        let last_name = req.body.last_name
        let status = req.body.status
        let year_level = req.body.year_level
        let section = req.body.section
        let academic_year = req.body.academic_year
        let index

        await Student.findOne({},{},{sort:{created_at: -1}}, async (error, lastRecord) => {
          if(error) return res.status(500).json({response: false, message: error.message})
          index = lastRecord.index+1
          student_id = parseInt(lastRecord.student_id)+1
          await new Student({
            index: index,
            student_id: student_id,
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            section: section,
            year_level: year_level,
            status: status,
            academic_year: academic_year
          }).save(async (error, newStudent)=>{
            if(error) return res.status(500).json({response: false, message: error.message})
            return res.status(201).json({response: true, message: 'Student registration success.', data: newStudent})
          })
        })
      } catch (error) {
        return res.status(500).json({response: false, message: error.message})
      }
    },
    getStudentByStudentID: async (req, res) => {
      try {
        let searchString = req.body.searchString
        let limit = req.body.limit
        let skip = req.body.skip
        let regexp = new RegExp("^"+ searchString, 'i')

        const count = await Student.countDocuments({ 
          $or: [
            {student_id: regexp},
            {first_name: regexp},
            {last_name: regexp},
            {course: regexp},
            {year_level: regexp},
          ] 
        });

        await Student.aggregate([
          {
            $addFields: {
              student_info: {
                $concat: ["$student_id", ' - ',"$last_name", ', ',"$first_name", ' - ', "$year_level", ' year ', "$course"],
              }
            },
          },
          {
            $match: {
              $or: [
                {student_id:regexp},
                {first_name: regexp},
                {last_name: regexp},
                {course: regexp},
                {year_level: regexp},
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
    },
    getStudentInfo: async (req, res) => {
      try {
        let user_id = res.user.id
        await Student.findOne({user_id: user_id}).exec((error, student)=>{
          if(error) return res.status(500).json({response:false,message:error.message})
          if(student){
            return res.status(200).json({response:true,data: student})
          }else{
            return res.status(500).json({response:false,message: 'Nothing found!'})
          }
        })
      } catch (error) {
        return res.status(500).json({response:false,message:error.message})
      }
    }
}
