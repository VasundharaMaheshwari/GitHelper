const express =  require('express')
const APIRouter = express.Router()
const { create,save,list,responder } = require('../controllers/AppController')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',save)

APIRouter.get('/respond',responder)

APIRouter.post('/respond',(req,res) => {
    return res.send(req.body) 
})

module.exports = APIRouter