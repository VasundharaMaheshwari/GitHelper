const express = require('express');
const { connectWallet } = require('../controllers/BlockChainController');
const { walletNotConnected } = require('../middlewares/middleware');
const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'walletBalance.hbs',
    balance: 1000,
    walletBalance: 0.001
  });
});

BlockChainRouter.post('/save-wallet', walletNotConnected, connectWallet);

module.exports = BlockChainRouter;