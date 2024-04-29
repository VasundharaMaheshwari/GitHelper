const express =  require('express')
const APIRouter = express.Router()
const { create,save,list } = require('../controllers/AppController')

APIRouter.get('/create',create)

APIRouter.get('/list',list)

APIRouter.post('/save',save)

APIRouter.get('/respond',(req,res) => {
    return res.send(req.query)
})

module.exports = APIRouter