module.exports = (user,roles)=>{
    return new Promise((resolve,reject) => {
        try {
            let valid = roles.find(role => {
                return role === user.role
            });
            if(valid){
                resolve()
            }else{
                reject('Not Allowed.')
            }
        } catch (error) {
            reject(error)
        }
    })
}