const { query,body } = require('express-validator')

const editQ = query(queryId).trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)

const delQ = query(queryId).trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)

const showR =  query(queryId).trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)

const saveR =  [query(queryId).trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
    body('contact_info').trim().notEmpty().matches(/^[0-9]{10}$/),
    body('skillset').trim().notEmpty().matches(/^[a-zA-Z0-9,.\s]+$/),
    body('github_id').trim().notEmpty().matches(/^[a-zA-Z0-9-]{1,39}$/),
    body('repo_link').trim().notEmpty().matches(/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_]+(\/)?$/),
    body('description').trim().notEmpty().matches(/^[a-zA-Z0-9.,!?;:\s]+$/)
]

module.exports = { editQ,delQ,showR,saveR }