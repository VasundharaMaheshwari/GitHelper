const express = require('express')
const QueryRouter = express.Router()

const { edit,delete_query,show_res,save_edit } = require('../controllers/QueryController')
const { edit_limit } = require('../middlewares/rate_limiter')

QueryRouter.get('/edit',edit)

QueryRouter.post('/edit_query',edit_limit,save_edit)

QueryRouter.get('/delete',delete_query)

QueryRouter.get('/response',show_res)

module.exports = QueryRouter