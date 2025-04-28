const { body, query, param } = require('express-validator');

const saveIssue = [body('contact_info').trim().notEmpty().matches(/^[0-9]{10}$/),
  body('skillset').trim().notEmpty().matches(/^[a-zA-Z0-9,.\s]+$/),
  body('github_id').trim().notEmpty().matches(/^[a-zA-Z0-9-]{1,39}$/),
  body('repo_link').trim().notEmpty().custom((value, { req }) => {
    const githubId = req.body.github_id;
    const repoRegex = new RegExp(`^(https?:\\/\\/)?(www\\.)?github\\.com\\/${githubId}\\/([a-zA-Z0-9-_]+)(\\/)?$`);
    if (!repoRegex.test(value)) {
      throw new Error('Invalid GitHub repository link.');
    }
    return true;
  }),
  body('description').trim().notEmpty().matches(/^[a-zA-Z0-9.,!?;:\s]+$/)
];

const saveRes = [body('issue_id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
  body('creator').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
  // body('github_id').trim().notEmpty().matches(/^[a-zA-Z0-9-]{1,39}$/)
];

const checkuser = [query('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/)];

const taskChecker = param('id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/);

const finishChecker = [param('id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
  param('action').trim().notEmpty().isIn([
    'accept',
    'reject'
  ])
];

const updateChecker = [body('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
  body('email').trim().notEmpty().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  body('github_id').trim().notEmpty().matches(/^[a-zA-Z0-9-]{1,39}$/)];

module.exports = { saveIssue, saveRes, checkuser, taskChecker, finishChecker, updateChecker };