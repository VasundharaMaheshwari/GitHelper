const express =  require('express')
const APIRouter = express.Router()
const { create,save,list,responder,save_response } = require('../controllers/AppController')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',save)

APIRouter.get('/respond',responder)

APIRouter.post('/respond',save_response)

module.exports = APIRouter