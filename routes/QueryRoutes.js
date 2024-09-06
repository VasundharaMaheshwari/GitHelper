const express = require('express')
const QueryRouter = express.Router()

const { edit,delete_query,show_res,save_edit } = require('../controllers/QueryController')
const { edit_limit } = require('../middlewares/rate_limiter')
const { editQ,delQ,showR,saveR } = require('../validators/QueryValidators')

QueryRouter.get('/edit',editQ,edit)

QueryRouter.post('/edit_query',saveR,edit_limit,save_edit)

QueryRouter.get('/delete',delQ,delete_query)

QueryRouter.get('/response',showR,show_res)

module.exports = QueryRouter