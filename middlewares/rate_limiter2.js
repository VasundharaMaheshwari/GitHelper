const limiter = require('express-rate-limit');

const forget_limit_ip = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 15,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Too_Many_Requests_To_Reset_Password_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const verify_limit_ip = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 30,
  legacyHeaders: false,
  requestWasSuccessful: (req, res) => res.status < 400,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Too_Many_Failed_Attempts_To_Verify_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

module.exports = { forget_limit_ip, verify_limit_ip };