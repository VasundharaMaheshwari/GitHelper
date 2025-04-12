const express = require('express');
const { connectWallet, displayWallet, tokenConversion } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');
const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletNotConnected, connectWallet);

BlockChainRouter.post('/claim', walletConnected, tokenConversion);

module.exports = BlockChainRouter;