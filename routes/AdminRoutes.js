const { loader, deleter, userlist, usermod, viewer, detailsBan, bannedUsers, reportViewer, reportCloser } = require('../controllers/AdminController');
const express = require('express');
const { idcheck, reportidcheck } = require('../validators/AdminValidators');
const { close_report_ip, delete_admin_ip } = require('../middlewares/rate_limiter2');

const AdminRouter = express.Router();

AdminRouter.get('/', loader);

AdminRouter.get('/home', detailsBan);

AdminRouter.get('/banlist', bannedUsers);

AdminRouter.get('/delete', idcheck, delete_admin_ip, deleter);

AdminRouter.get('/userlist', userlist);

AdminRouter.get('/delete-user', idcheck, delete_admin_ip, usermod);

AdminRouter.get('/view', idcheck, viewer);

AdminRouter.get('/reported', reportViewer);

AdminRouter.post('/closeReport', reportidcheck, close_report_ip, reportCloser);

module.exports = AdminRouter;