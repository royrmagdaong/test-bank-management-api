const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10;
const generateCode = require('../middlewares/generateCode');

module.exports = {
    // get all user
    getAllUser: async (req, res) => {
        try {
            let regexp = new RegExp("^"+ req.body.searchString, 'i')
            let admin = req.body.admin ? 'admin': null
            let professor = req.body.professor ? 'professor': null
            let student = req.body.student ? 'student': null
            let users
            
            users = await User.find({ 
                $and: [
                    { email: regexp },
                    { deleted_at: null },
                    { role: { $in: [admin, professor, student] } }
                ]
            })

            res.json({ response: true, data: users })
        } catch (error) {
            res.status(500).json({ response: false, message: error.message })
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
}
