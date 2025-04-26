const { loader, deleter, userlist, usermod, viewer, detailsBan, bannedUsers } = require('../controllers/AdminController');
const express = require('express');
const { idcheck } = require('../validators/AdminValidators');
const { Report } = require('../models/Report');
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');

const AdminRouter = express.Router();

AdminRouter.get('/', loader);

AdminRouter.get('/home', detailsBan);

AdminRouter.get('/banlist', bannedUsers);

AdminRouter.get('/delete', idcheck, deleter);

AdminRouter.get('/userlist', userlist);

AdminRouter.get('/delete-user', idcheck, usermod);

AdminRouter.get('/view', idcheck, viewer);

AdminRouter.get('/reported', async (req, res) => {
  try {
    const reports = await Report.find({ closed_by: null })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username')
      .populate('createdAgainst', 'username')
      .lean();

    return res.status(200).render('main.hbs', {
      layout: 'admin_report.hbs',
      reports: reports
    });
  } catch {
    return res.status(500).send('Internal Server Error');
  }
});

AdminRouter.post('/closeReport', async (req, res) => {
  try {
    let { reportId } = req.body;

    reportId = new mongoose.Types.ObjectId(reportId);

    if (!ObjectId.isValid(reportId)) return res.status(400).redirect('/error?error_details=Invalid');

    const available = await Report.findById(reportId);
    if (!available) return res.status(400).redirect('/error?error_details=Report_Not_Found');

    if (req.user.role === 'Admin') {
      await Report.findByIdAndUpdate(reportId, { closed_by: req.user._id });
    } else {
      return res.status(401).redirect('/error?error_details=Only_Admins_Can_Close_Queries');
    }

    return res.status(201).redirect('/admin/reported');
  } catch {
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = AdminRouter;