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

const close_report_ip = limiter({
  windowMs: 2 * 60 * 1000,
  max: 15,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Too_Many_Requests_To_Close_Reports_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const delete_admin_ip = limiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Too_Many_Requests_To_Enforce_Moderation_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const gen_url_ip = limiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Too_Many_Requests_To_Report_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const updater_ip = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Too_Many_Requests_To_Update_Details_Please_Wait_Till_${req.rateLimit.resetTime}`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const wallet_ip = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Please_Wait_Till_${req.rateLimit.resetTime}_To_Connect_Your_Wallet`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const claim_ip = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Please_Wait_Till_${req.rateLimit.resetTime}_To_Claim_Your_Points`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

const redeem_ip = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 15,
  legacyHeaders: false,
  // requestWasSuccessful: (req, res) => res.status < 400,
  // skipSuccessfulRequests: true,
  handler: (req, res) => {
    const date = new Date(req.rateLimit.resetTime);
    req.rateLimit.resetTime = date.toLocaleString();
    return res.status(429).redirect(`/error?error_details=Please_Wait_Till_${req.rateLimit.resetTime}_To_Redeem_Your_Tokens`);
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

module.exports = { forget_limit_ip, verify_limit_ip, close_report_ip, delete_admin_ip, gen_url_ip, updater_ip, wallet_ip, claim_ip, redeem_ip };