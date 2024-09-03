const express =  require('express')
const APIRouter = express.Router()
const { create,save,list,responder,save_response } = require('../controllers/AppController')
const { issue_limit,response_limit } = require('../middlewares/rate_limiter')
const { saveIssue,resIssue } = require('../validators/AppValidators')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',saveIssue,issue_limit,save)

APIRouter.get('/respond',resIssue,responder)

APIRouter.post('/respond',response_limit,save_response)

module.exports = APIRouter