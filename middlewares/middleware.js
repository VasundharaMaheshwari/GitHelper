const { ObjectId } = require('mongodb')
const { Issue } = require('../models/Issue')
const { getUser } = require('../services/auth')
const { Response } = require('../models/Response')

const restrict = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    if(!UserUID){
        return res.status(401).redirect('/api/login')
    }
    const user = getUser(UserUID)
    if(!user){
        return res.status(401).redirect('/api/login')
    }

    if(user.role == "Admin"){
        return res.status(403).redirect('/admin')
    }

    if(user.role != "User"){
        return res.status(401).redirect('/error?error_details=Access_Denied')
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
        return res.status(401).redirect('/api/login')
    }
    const user = getUser(UserUID)
    if(!user){
        return res.status(401).redirect('/api/login')
    }

    if(user.role == "User"){
        return res.status(403).redirect('/api/user')
    }

    if(user.role != "Admin"){
        return res.status(401).redirect('/error?error_details=Access_Denied')
    }

    req.user = user
    next()
}

const loggedIn = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    const user = getUser(UserUID)
    if(user){
        return res.status(400).redirect('/api/user')
    }

    req.user = user
    next()
}

const query_check = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    if(!UserUID){
        return res.status(401).redirect('/api/login')
    }
    const user = getUser(UserUID)
    if(!user){
        return res.status(401).redirect('/api/login')
    }
    if(user.role == "Admin"){
        return res.status(403).redirect('/admin')
    }
    const {queryId} = req.query
    if(!ObjectId.isValid(queryId)){
        return res.status(404).redirect('/query/list')
    }
    req.user = user
    next()
}

const chat_check = async (req,res,next) => {
    const UserUID = req.cookies?.uid
    if(!UserUID){
        return res.status(401).redirect('/api/login')
    }
    const user = getUser(UserUID)
    if(!user){
        return res.status(401).redirect('/api/login')
    }
    if(user.role == "Admin"){
        return res.status(403).redirect('/admin')
    }
    const {resId} = req.query
    if(!ObjectId.isValid(resId)){
        return res.status(404).redirect('/query/list')
    }

    const response_approved = await Response.findOne({'_id': resId})

    if(!response_approved){
        return res.status(404).redirect('/query/list')
    }

    if(!response_approved.approved){
        return res.status(404).redirect('/error?error_details=Not_Allowed_Response_Approval_Pending')
    }

    req.user = user
    next()
}

module.exports = { restrict,less_restrict,admin,loggedIn,query_check,chat_check }