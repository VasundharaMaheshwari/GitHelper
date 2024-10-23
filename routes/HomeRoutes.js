const express = require('express');
const HomeRouter = express.Router();
const { refresh,details,logout } = require('../controllers/HomeController');
const { homecheck } = require('../validators/HomeValidators');

HomeRouter.get('/',refresh);

HomeRouter.get('/view',homecheck,details);

HomeRouter.get('/logout',logout);

module.exports = HomeRouter;