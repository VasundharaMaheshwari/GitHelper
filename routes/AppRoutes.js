const express =  require('express')
const APIRouter = express.Router()
const { create,save,list,responder,save_response } = require('../controllers/AppController')
const { issue_limit,response_limit } = require('../middlewares/rate_limiter')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',issue_limit,save)

APIRouter.get('/respond',responder)

APIRouter.post('/respond',response_limit,save_response)

APIRouter.get('/edit',(req,res) => {
    return res.status(201).send('Success')
})

APIRouter.get('/delete',(req,res) => {
    return res.status(201).send('Success')
})

module.exports = APIRouter