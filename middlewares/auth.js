const { getUser } = require('../services/auth')

const restrict = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    if(!UserUID){
        return res.redirect('/api/login')
    }
    const user = getUser(UserUID)
    if(!user){
        return res.redirect('/api/login')
    }

    req.user = user
    next()
}

module.exports = { restrict }