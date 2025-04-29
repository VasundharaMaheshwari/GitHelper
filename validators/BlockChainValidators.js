const { body } = require('express-validator');

const walletCheckAddress = [body('walletAddress').trim().notEmpty().matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)];

const pointsCheck = body('pointsClaimed').trim().notEmpty().matches(/^(50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800|850|900|950|1000)$/
);

const prepTrans = [body('sender').trim().notEmpty().matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/),
  body('queryId').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)
];

module.exports = { walletCheckAddress, pointsCheck, prepTrans };