const Professor = require('../models/professor')

module.exports = {
    getProfessors: async (req,res)=>{
        try {
            let searchString = req.body.searchString
            let limit = req.body.limit
            let skip = req.body.skip
            let regexp = new RegExp("^"+ searchString, 'i')

            const count = await Professor.countDocuments({ 
                $or: [
                    {id_number: regexp}, 
                    {first_name: regexp}, 
                    {middle_name: regexp}, 
                    {last_name: regexp},
                    {address: regexp},
                    {civil_status: regexp},
                    {specialization: regexp},
                    {email: regexp},
                ] 
            });

            await Professor.aggregate([
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
                        {id_number: regexp}, 
                        {first_name: regexp}, 
                        {middle_name: regexp}, 
                        {last_name: regexp},
                        {address: regexp},
                        {civil_status: regexp},
                        {specialization: regexp},
                        {email: regexp},
                    ]
                    }
                },
                { $limit: limit + skip },
                { $skip: skip }
                ]).exec((error, prof) => {
                if(error) return res.json({response: false, message: error.message})
                return res.json({
                    response: true, 
                    data: prof, 
                    count: count,
                    limit: limit,
                    skip: skip
                })
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    createProfessor: async (req, res) => {
        try {
            let index
            let id_number
            let first_name = req.body.first_name
            let last_name = req.body.last_name
            let middle_name = req.body.middle_name
            let department = req.body.department
            let email = req.body.email
            let civil_status = req.body.civil_status

            await Professor.findOne({},{},{sort:{created_at: -1}}, async (error, lastRecord) => {
                if(error) return res.status(500).json({response:false, message:error.message})
                index = lastRecord.index+1
                id_number = parseInt(lastRecord.id_number)+1

                await new Professor({
                    id_number: id_number,
                    index: index,
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    department: department,
                    email: email,
                    civil_status: civil_status
                }).save(async (error, newProf) =>{
                    if(error) return res.status(500).json({response:false, message:error.message})
                    res.status(201).json({response:true, data: newProf})
                })
            })
        } catch (error) {
            return res.status(500).json({response:false, message:error.message})
        }
    },
    getProfessorInfo: async (req, res) => {
        try {
          let user_id = res.user.id
          await Professor.findOne({user_id: user_id}).exec((error, professor)=>{
            if(error) return res.status(500).json({response:false,message:error.message})
            if(professor){
              return res.status(200).json({response:true,data: professor})
            }else{
              return res.status(500).json({response:false,message: 'Nothing found!'})
            }
          })
        } catch (error) {
          return res.status(500).json({response:false,message:error.message})
        }
      }
}
