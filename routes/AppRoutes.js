const express =  require('express')
const APIRouter = express.Router()
const { create,save } = require('../controllers/AppController')

APIRouter.get('/create',create)

APIRouter.post('/save',save)

module.exports = APIRouter