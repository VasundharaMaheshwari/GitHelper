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

const less_restrict = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    
    const user = getUser(UserUID)

    req.user = user
    next()
}

const admin = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    if(!UserUID){
        return res.redirect('/api/login')
    }
    const user = getUser(UserUID)
    if(!user){
        return res.redirect('/api/login')
    }

    if(user.role == "User"){
        return res.redirect('/api/user')
    }

    if(user.role != "Admin"){
        return res.redirect('/error?error_details=Access_Denied')
    }

    req.user = user
    next()
}

const loggedIn = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    if(UserUID){
        return res.redirect('/api/user')
    }
    const user = getUser(UserUID)
    if(user){
        return res.redirect('/api/user')
    }

    req.user = user
    next()
}

module.exports = { restrict,less_restrict,admin,loggedIn }