const express = require('express');
const { connectWallet, displayWallet, tokenConversion, pushRequests, confirmed, rejected } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');
const { walletCheckAddress, pointsCheck, prepTrans, rejectedCheck, acceptedCheck } = require('../validators/BlockChainValidators');
const { wallet_ip, claim_ip, redeem_ip } = require('../middlewares/rate_limiter2');

const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletCheckAddress, wallet_ip, walletNotConnected, connectWallet);

BlockChainRouter.post('/claim', pointsCheck, claim_ip, walletConnected, tokenConversion);

BlockChainRouter.post('/prepare-transaction', prepTrans, redeem_ip, walletConnected, pushRequests);

BlockChainRouter.post('/confirm-transaction', acceptedCheck, redeem_ip, walletConnected, confirmed);

BlockChainRouter.post('/reject-transaction', rejectedCheck, redeem_ip, walletConnected, rejected);

module.exports = BlockChainRouter;