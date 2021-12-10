const jwt = require('jsonwebtoken');

module.exports = (token)=>{
    return new Promise((resolve,reject) => {
        try {
            jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
                if(error){
                    reject(error)
                }else{
                    resolve(user)
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}