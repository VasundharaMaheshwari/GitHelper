const limiter = require('express-rate-limit');

const register_limit = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipFailedRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Cannot_Create_More_Accounts_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const login_limit = limiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  requestWasSuccessful: (req, res) => res.status < 400,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Login_Disabled_Due_To_Too_Many_Attempts_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => req.body.username
});

const login_limit_ip = limiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  legacyHeaders: false,
  requestWasSuccessful: (req, res) => res.status < 400,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Login_Completely_Disabled_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const issue_limit = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipFailedRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Maximum_Number_Of_Queries_Created_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => req.body.id
});

const response_limit = limiter({
  windowMs: 10 * 60 * 60 * 1000,
  max: 10,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipFailedRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Maximum_Number_Of_Responses_Sent_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => req.body.id
});

const edit_limit = limiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipFailedRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Maximum_Number_Of_Edits_Made_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => req.body.id + req.query.queryId
});

const convo_limit = limiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  //requestWasSuccessful: (req, res) => res.status < 400,
  //skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Chat_Disabled_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => req.body.queryId
});

const overall_limit = limiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipFailedRequests: true,
  handler: (req, res) => {
    return res.status(429).send('Not Allowed');
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const contact_limit = limiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipFailedRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Contact_Us_Disabled_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const reset_limit = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Forgot_Password_Disabled_Due_To_Too_Many_Attempts_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => req.params.id
});

const reset_limit_ip = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Forgot_Password_Completely_Disabled_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

module.exports = { register_limit, login_limit, issue_limit, response_limit, login_limit_ip, edit_limit, convo_limit, overall_limit, contact_limit, reset_limit, reset_limit_ip };