const express = require('express');
const { connectWallet, displayWallet } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');
const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletNotConnected, connectWallet);

module.exports = BlockChainRouter;