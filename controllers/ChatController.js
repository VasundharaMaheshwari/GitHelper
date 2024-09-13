const { ObjectId } = require('mongodb')
const { Response } = require('../models/Response')
const { validationResult } = require('express-validator')

const chatload = async (req,res) => {
    try{
        const error = validationResult(req)
        const checker2 = ObjectId.isValid(req.user._id)
        if(checker2 && error.isEmpty()){
        const checker = await Response.findOne({"responder.username": req.query.username,"creator": req.user._id})
        if(checker) {
    return res.status(200).render('main.hbs',{layout: "chat.hbs",
        receiverUsername: req.query.username
      }
    )
} else {
    return res.status(400).redirect('/error?error_details=Invalid_URL')
}
        } else {
            return res.status(403).redirect('/error?error_details=Not_Allowed')
        }
    } catch (err) {
        return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
}

module.exports = { chatload }