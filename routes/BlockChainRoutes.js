const express = require('express');
const { connectWallet, displayWallet, tokenConversion, pushRequests, confirmed, rejected } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');
const { walletCheckAddress, pointsCheck, prepTrans, rejectedCheck, acceptedCheck } = require('../validators/BlockChainValidators');

const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletCheckAddress, walletNotConnected, connectWallet);

BlockChainRouter.post('/claim', pointsCheck, walletConnected, tokenConversion);

BlockChainRouter.post('/prepare-transaction', prepTrans, walletConnected, pushRequests);

BlockChainRouter.post('/confirm-transaction', acceptedCheck, walletConnected, confirmed);

BlockChainRouter.post('/reject-transaction', rejectedCheck, walletConnected, rejected);

module.exports = BlockChainRouter;