const express =  require('express')
const APIRouter = express.Router()
const { create,save,list } = require('../controllers/AppController')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',save)

module.exports = APIRouter