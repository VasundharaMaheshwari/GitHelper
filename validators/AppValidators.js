const { body,query } = require('express-validator')

const saveIssue = [body('contact_info').trim().notEmpty().matches(/^[0-9]{10}$/),
    body('skillset').trim().notEmpty().matches(/^[a-zA-Z0-9,.\s]+$/),
    body('github_id').trim().notEmpty().matches(/^[a-zA-Z0-9-]{1,39}$/),
    body('repo_link').trim().notEmpty().matches(/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_]+(\/)?$/),
    body('description').trim().notEmpty().matches(/^[a-zA-Z0-9.,!?;:\s]+$/)
]

const resIssue = [query('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
    query('_id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)
]

const saveRes = [body('issue_id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
    body('creator').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
    body('github_id').trim().notEmpty().matches(/^[a-zA-Z0-9-]{1,39}$/)
]

module.exports = { saveIssue,resIssue,saveRes }