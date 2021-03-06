const User = require('../models/user')
const Student = require('../models/student')
const Professor = require('../models/professor')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10;
const generateCode = require('../middlewares/generateCode');

module.exports = {
    // get all user
    getAllUser: async (req, res) => {
        try {
            let limit = req.body.limit
            let skip = req.body.skip
            let search = req.body.searchString
            let regexp = new RegExp("^"+ search, 'i')

            const count = await User.countDocuments({ $or: [{account_name: regexp}, {email: regexp}, {role: regexp}] });

            await User.aggregate([
                { $match: { $or: [{account_name: regexp}, {email: regexp}, {role: regexp}] } },
                { $limit: limit + skip },
                { $skip: skip }
            ]).exec((error, users) => {
                if(error) return res.status(500).json({ response: false, message: error.message })
                if(users){
                    return res.status(200).json({ 
                        response: true,
                        data: users,
                        count: count,
                        limit: limit,
                        skip: skip
                    })
                }else{
                    return res.status(404).json({ response: false, message: 'no data' })
                }
            })
            
        } catch (error) {
            return res.status(500).json({ response: false, message: error.message })
        }
    },
    // sign in user
    signInUser: async (req, res) => {
        let user
        try {
            user = await User.findOne({ email: req.body.email}).where('deleted_at').equals(null)
            if(user){
                if(user.is_verified){
                    bcrypt.compare(req.body.password, user.password, (err, result) => {
                        if(err){
                            return res.json({ err })
                        }else{
                            if(result){
                                jwt.sign({id: user._id, role: user.role, email: user.email}, process.env.SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
                                    if(err){
                                        return res.json({ message: err.message, reponse: false })
                                    }else{
                                        return res.status(200).json({
                                            data: { id: user._id, role: user.role, email: user.email, token },
                                            response: true
                                        })
                                    }
                                });
                            }else{
                                return res.json({ message: "incorrect password", reponse: false })
                            }
                        }
                    })
                }else{
                    return res.json({ message: "User is not verified", reponse: false})
                }
            }else{
                return res.json({ message: "Incorrect username or password", reponse: false})
            }
        } catch (error) {
            return res.json({ message: "User doesn't exist.", reponse: false })
        }
    },
    createUser: async (req, res) => {
        try {
            let id = req.body.id
            let account_name = req.body.account_name
            let email = req.body.email
            let role = req.body.role
            let password = req.body.password

            if(role==='Administrator') role = 'admin'
            if(role==='Instructor') role = 'professor'
            if(role==='Student') role = 'student'

            await bcrypt.hash(password, 10, async (error, hashPassword) => {
                if(error) return res.status(500).json({response: false, message:error.message})
                let user = await new User({
                    role: role,
                    account_name: account_name,
                    email: email,
                    password: hashPassword
                })
                await user.save(async (error, newUser)=>{
                    if(error) return res.status(500).json({response: false, message:error.message})
                    if(newUser){
                        if(role==='student'){
                            await Student.findOne({_id:id}).exec(async (error, student)=>{
                                if(error) return res.status(500).json({response: false, message:error.message})
                                if(student){
                                    student.user_id = newUser._id
                                    student.email = email
                                    student.save((error)=>{
                                        if(error) return res.status(500).json({response: false, message:error.message})
                                    })
                                    return res.status(201).json({response: true, message: `${email} is created successfully!`})
                                }else{
                                    console.log(id)
                                    return res.status(500).json({response: false, message: `creation failed!`})
                                }
                            })
                        }
                        if(role==='professor'){
                            await Professor.findOne({_id:id}).exec(async (error, professor)=>{
                                if(error) return res.status(500).json({response: false, message:error.message})
                                if(professor){
                                    professor.user_id = newUser._id
                                    professor.email = email
                                    professor.save((error)=>{
                                        if(error) return res.status(500).json({response: false, message:error.message})
                                    })
                                    return res.status(201).json({response: true, message: `${email} is created successfully!`})
                                }else{
                                    return res.status(500).json({response: false, message: `creation failed!`})
                                }
                            })
                        }
                        if(role==='admin'){
                            return res.status(201).json({response: true, message: `${email} is created successfully!`})
                        }
                    }else{
                        return res.status(500).json({response: false, message: `creation failed!`})
                    }
                })
            })
        } catch (error) {
            return res.status(500).json({response: false, message:error.message})
        }
    }
}
