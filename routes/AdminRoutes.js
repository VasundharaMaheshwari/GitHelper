const { loader, deleter, userlist, usermod, viewer, detailsBan, bannedUsers } = require('../controllers/AdminController');
const express = require('express');
const { idcheck } = require('../validators/AdminValidators');
const { Report } = require('../models/Report');

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
    const reports = await Report.find()
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


module.exports = AdminRouter;