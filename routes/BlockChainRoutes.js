const express = require('express');
const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'walletBalance.hbs',
    balance: 1000,
    walletBalance: 0.001
  });
});

BlockChainRouter.get('/connect-wallet', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'connectWallet.hbs'
  });
});

module.exports = BlockChainRouter;