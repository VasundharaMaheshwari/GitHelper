const express =  require('express')
const APIRouter = express.Router()
const { create,save,list,save_response,tracker } = require('../controllers/AppController')
const { issue_limit,response_limit } = require('../middlewares/rate_limiter')
const { saveIssue,saveRes } = require('../validators/AppValidators')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',saveIssue,issue_limit,save)

APIRouter.post('/respond',saveRes,response_limit,save_response)

APIRouter.get('/track',tracker)

module.exports = APIRouter