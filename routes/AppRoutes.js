const express =  require('express')
const APIRouter = express.Router()
const { create,save,list,responder,save_response } = require('../controllers/AppController')
const { edit,delete_query,show_res } = require('../controllers/AppController2')
const { issue_limit,response_limit } = require('../middlewares/rate_limiter')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',issue_limit,save)

APIRouter.get('/respond',responder)

APIRouter.post('/respond',response_limit,save_response)

APIRouter.get('/edit',edit)

APIRouter.post('/edit_query',(req,res) => {
    return res.status(200).send('WIP')
})

APIRouter.get('/delete',delete_query)

APIRouter.get('/response',show_res)

module.exports = APIRouter