const express = require('express');
const { connectWallet, displayWallet, tokenConversion, pushRequests, confirmed, rejected } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');

const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletNotConnected, connectWallet);

BlockChainRouter.post('/claim', walletConnected, tokenConversion);

BlockChainRouter.post('/prepare-transaction', walletConnected, pushRequests);

BlockChainRouter.post('/confirm-transaction', walletConnected, confirmed);

BlockChainRouter.post('/reject-transaction', walletConnected, rejected);

module.exports = BlockChainRouter;