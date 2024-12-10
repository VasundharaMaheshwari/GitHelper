const { ObjectId } = require('mongodb');
const { Response } = require('../models/Response');
const { GHUser } = require('../models/GHUser');
const { OTP } = require('../models/OTP');

const restrict = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    return res.status(401).redirect('/api/login');
  }

  if (user.role === 'Admin') {
    return res.status(403).redirect('/admin/home');
  }

  if (user.role !== 'User') {
    return res.status(401).redirect('/error?error_details=Access_Denied');
  }

  req.user = user;
  next();
};

const less_restrict = async (req, res, next) => {
  const UserUID = req.session?.userId;

  const user = await GHUser.findById(UserUID);

  req.user = user;
  next();
};

const admin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    return res.status(401).redirect('/api/login');
  }

  if (user.role === 'User') {
    return res.status(403).redirect('/api/user');
  }

  if (user.role !== 'Admin') {
    return res.status(401).redirect('/error?error_details=Access_Denied');
  }

  req.user = user;
  next();
};

const loggedIn = async (req, res, next) => {
  const UserUID = req.session?.userId;
  const user = await GHUser.findById(UserUID);
  if (user) {
    return res.status(400).redirect('/api/user');
  }

  req.user = user;
  next();
};

const logOut = async (req, res, next) => {
  const UserUID = req.session?.userId;
  const user = await GHUser.findById(UserUID);
  if (!user) {
    return res.status(400).redirect('/api/login');
  }

  req.user = user;
  next();
};

const query_check = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    return res.status(401).redirect('/api/login');
  }
  if (user.role === 'Admin') {
    return res.status(403).redirect('/admin/home');
  }
  const { queryId } = req.query;
  if (!ObjectId.isValid(queryId)) {
    return res.status(404).redirect('/query/list');
  }
  req.user = user;
  next();
};

const chat_check = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect('/api/login');
  }
  const user = await GHUser.findById(req.session.userId);
  if (!user) {
    return res.status(401).redirect('/api/login');
  }
  if (user.role === 'Admin') {
    return res.status(403).redirect('/admin/home');
  }
  const { resId } = req.query;
  if (!ObjectId.isValid(resId)) {
    return res.status(404).redirect('/query/list');
  }

  const response_approved = await Response.findOne({ '_id': resId, $or: [{ 'responder.uid': user._id }, { 'creator': user._id }] });

  if (!response_approved) {
    return res.status(404).redirect('/query/list');
  }

  if (!response_approved.approved) {
    return res.status(404).redirect('/error?error_details=Not_Allowed_Response_Approval_Pending');
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

  const otpc = await OTP.findOne({ email: userCheck.email });

  if (otpc) {
    req.user = user;
    next();
  } else {
    res.status(400).redirect('/api/forgot-password');
  }
};

module.exports = { restrict, less_restrict, admin, loggedIn, query_check, chat_check, logOut, loggedInPass };