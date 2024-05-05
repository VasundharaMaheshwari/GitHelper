const limiter = require('express-rate-limit')

const register_limit = limiter({
    windowMs: 24*60*60*1000,
    max: 3,
    legacyHeaders: false,
    handler: (req,res) => {
        const date = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = date.toLocaleTimeString()
        return res.redirect(`/error?error_details=Cannot_Create_More_Accounts_Till_${req.rateLimit.resetTime}`)
    }
})

const login_limit = limiter({
    windowMs: 60*60*1000,
    max: 5,
    legacyHeaders: false,
    handler: (req,res) => {
        const date = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = date.toLocaleTimeString()
        return res.redirect(`/error?error_details=Login_Disabled_Due_To_Too_Many_Failed_Attempts_Till_${req.rateLimit.resetTime}`)
    },
    skipSuccessfulRequests: true
})

const issue_limit = limiter({
    windowMs: 60*60*1000,
    max: 5,
    legacyHeaders: false,
    handler: (req,res) => {
        const date = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = date.toLocaleTimeString()
        return res.redirect(`/error?error_details=Maximum_Number_Of_Queries_Created_Please_Wait_Till_${req.rateLimit.resetTime}`)
    },
    skipSuccessfulRequests: true
})

const response_limit = limiter({
    windowMs: 60*60*1000,
    max: 10,
    legacyHeaders: false,
    handler: (req,res) => {
        const date = new Date(req.rateLimit.resetTime)
        req.rateLimit.resetTime = date.toLocaleTimeString()
        return res.redirect(`/error?error_details=Maximum_Number_Of_Responses_Sent_Please_Wait_Till_${req.rateLimit.resetTime}`)
    },
    skipSuccessfulRequests: true
})

module.exports = { register_limit,login_limit,issue_limit,response_limit }