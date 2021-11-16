const User = require('../models/user')
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
}
