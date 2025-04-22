const express = require('express');
const HomeRouter = express.Router();
const { refresh, details, logout, searchLoad, searchPost } = require('../controllers/HomeController');
const { homecheck } = require('../validators/HomeValidators');
const { logOut } = require('../middlewares/middleware');

HomeRouter.get('/', refresh);

HomeRouter.get('/view', homecheck, details);

HomeRouter.get('/logout', logOut, logout);

HomeRouter.get('/search', searchLoad);

HomeRouter.post('/search', searchPost);

module.exports = HomeRouter;