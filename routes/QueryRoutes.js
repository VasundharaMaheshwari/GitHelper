const express = require('express')
const QueryRouter = express.Router()

const { edit,delete_query,show_res,save_edit } = require('../controllers/QueryController')

QueryRouter.get('/edit',edit)

QueryRouter.post('/edit_query',save_edit)

QueryRouter.get('/delete',delete_query)

QueryRouter.get('/response',show_res)

module.exports = QueryRouter