const { ObjectId } = require('mongodb');
const { Response } = require('../models/Response');
const { GHUser } = require('../models/GHUser');
const { OTP } = require('../models/OTP');
const { default: mongoose } = require('mongoose');
const { Issue } = require('../models/Issue');

const restrict = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    req.session.destroy();
    res.clearCookie('session');
    return res.status(401).redirect('/api/login');
  }

  if (user.role === 'Admin') {
    return res.status(403).redirect('/admin/home');
  }

  if (user.role !== 'User') {
    return res.status(401).redirect('/error?error_details=Access_Denied');
  }

  if (!user.verified) {
    res.cookie('verify', user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'Lax'
    });

    return res.status(400).redirect('/auth/github');
  }

  req.user = user;
  next();
};

const less_restrict = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  const UserUID = req.session?.userId;

  const user = await GHUser.findById(UserUID);

  req.user = user;
  next();
};

const admin = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    req.session.destroy();
    res.clearCookie('session');
    return res.status(401).redirect('/api/login');
  }

  if (user.role === 'User') {
    return res.status(403).redirect('/api/user');
  }

  if (user.role !== 'Admin') {
    return res.status(401).redirect('/error?error_details=Access_Denied');
  }

  if (!user.verified) {
    res.cookie('verify', user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'Lax'
    });

    return res.status(400).redirect('/auth/github');
  }

  req.user = user;
  next();
};

const loggedIn = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  const UserUID = req.session?.userId;
  const user = await GHUser.findById(UserUID);
  if (user) {
    return res.status(400).redirect('/api/user');
  }

  req.user = user;
  next();
};

const logOut = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  const UserUID = req.session?.userId;
  const user = await GHUser.findById(UserUID);
  if (!user) {
    req.session.destroy();
    res.clearCookie('session');
    return res.status(400).redirect('/api/login');
  }

  req.user = user;
  next();
};

const query_check = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    req.session.destroy();
    res.clearCookie('session');
    return res.status(401).redirect('/api/login');
  }
  if (user.role === 'Admin') {
    return res.status(403).redirect('/admin/home');
  }
  if (!user.verified) {
    res.cookie('verify', user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'Lax'
    });

    return res.status(400).redirect('/auth/github');
  }
  const { queryId } = req.query;
  if (!ObjectId.isValid(queryId)) {
    return res.status(404).redirect('/query/list');
  }

  const query = await Issue.findOne({ _id: queryId, completed: false });
  if (!query) {
    return res.status(404).redirect('/query/list');
  }

  req.user = user;
  next();
};

const chat_check = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    req.session.destroy();
    res.clearCookie('session');
    return res.status(401).redirect('/api/login');
  }
  if (user.role === 'Admin') {
    return res.status(403).redirect('/admin/home');
  }
  if (!user.verified) {
    res.cookie('verify', user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'Lax'
    });

    return res.status(400).redirect('/auth/github');
  }
  // const { resId } = req.query;
  // if (!ObjectId.isValid(resId)) {
  //   return res.status(404).redirect('/query/list');
  // }

  const response_approved = await Response.findOne({ $or: [{ 'responder.uid': user._id }, { 'creator': user._id }], $nor: [{ 'status': 'Not Approved' }, { 'status': 'Accepted' }] });

  if (!response_approved) {
    return res.status(404).redirect('/error?error_details=Valid_Approved_Response_To_Query_Not_Found');
  }

  if (!response_approved.approved || (response_approved.status !== 'To Do' && response_approved.status !== 'Working' && response_approved.status !== 'Completed')) {
    return res.status(404).redirect('/error?error_details=Not_Allowed_Response_Approval_Missing');
  }

  req.user = user;
  next();
};

const loggedInPass = async (req, res, next) => {
  const UserUID = req.session?.userId;
  const user = await GHUser.findById(UserUID);
  if (user) {
    return res.status(400).redirect('/api/user');
  }

  const { id } = req.params;

  const userCheck = ObjectId.isValid(id) ? await GHUser.findById(id) : res.status(400).redirect('/api/register');

  const otpc = await OTP.findOne({ email: userCheck.email.address });

  if (otpc) {
    req.user = user;
    next();
  } else {
    res.status(400).redirect('/api/forgot-password');
  }
};

const ghAuth = async (req, res, next) => {
  if (req.signedCookies?.refresh) {
    res.clearCookie('refresh');
  }
  if (!req.signedCookies?.verify) {
    return res.status(400).redirect('/api/register');
  }
  const user = await GHUser.findById(new mongoose.Types.ObjectId(req.signedCookies.verify));

  if (user.verified) {
    res.clearCookie('verify');
    return res.status(400).redirect('/api/user');
  }

  next();
};

const gitCheck = async (req, res, next) => {
  const user = await GHUser.findById(new mongoose.Types.ObjectId(req.signedCookies.verify));

  if (user.github_id.verified) {
    return res.status(400).redirect('/auth/email-verify');
  }

  next();
};

const mailCheck = async (req, res, next) => {
  const user = await GHUser.findById(new mongoose.Types.ObjectId(req.signedCookies.verify));

  if (user.email.verified) {
    return res.status(400).redirect('/api/login');
  }

  next();
};

const gitRefreshCheck = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }

  if (!req.signedCookies.refresh) {
    return res.status(400).redirect('/api/user');
  }

  const incomplete = new mongoose.Types.ObjectId(req.signedCookies.refresh);

  if (!new mongoose.Types.ObjectId(req.session.userId).equals(incomplete)) {
    return res.status(400).redirect('/api/user');
  }

  const user = await GHUser.findById(incomplete);

  if (!user) {
    req.session.destroy();
    res.clearCookie('session');
    return res.status(401).redirect('/api/login');
  }

  if (user.role === 'Admin') {
    return res.status(403).redirect('/admin/home');
  }

  if (user.role !== 'User') {
    return res.status(401).redirect('/error?error_details=Access_Denied');
  }

  if (!user.verified) {
    res.cookie('verify', user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'Lax'
    });

    return res.status(400).redirect('/auth/github');
  }

  req.user = user;
  next();
};

module.exports = { restrict, less_restrict, admin, loggedIn, query_check, chat_check, logOut, loggedInPass, ghAuth, gitCheck, mailCheck, gitRefreshCheck };