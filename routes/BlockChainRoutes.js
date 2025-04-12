const express = require('express');
const { connectWallet, displayWallet, tokenConversion } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');
const { redeemRewards, confirmTransaction } = require('../services/claim');
const { ObjectId } = require('mongodb');
const { Issue } = require('../models/Issue');
const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletNotConnected, connectWallet);

BlockChainRouter.post('/claim', walletConnected, tokenConversion);

BlockChainRouter.post('/prepare-transaction', walletConnected, async (req, res) => {
  try {
    const { sender, queryId } = req.body;
    const queryCheck = await Issue.findOne({ _id: queryId, createdBy: req.user._id, priority: 0 });
    if (!ObjectId.isValid(queryId) || !queryCheck) return res.json({ message: 'Valid Query Not Found' });
    let transaction;
    try {
      transaction = await redeemRewards(sender, 5 * 1e9);
      await Issue.findByIdAndUpdate(queryId, { inProgress: true });
    } catch {
      return res.json({ message: 'Insufficient Balance' });
    }
    return res.json({ transaction });
  } catch {
    return res.status(500).send('Internal Server Error');
  }
});

BlockChainRouter.post('/confirm-transaction', walletConnected, async (req, res) => {
  const { transaction, queryId } = req.body;
  if (await confirmTransaction(transaction)) {
    await Issue.findOneAndUpdate({ _id: queryId, inProgress: true }, { priority: 1, inProgress: false });
  }
  return res.json({ message: 'Successfully updated' });
});

BlockChainRouter.post('/reject-transaction', walletConnected, async (req, res) => {
  const { queryId } = req.body;
  await Issue.findOneAndUpdate({ _id: queryId, inProgress: true }, { inProgress: false });
  return res.json({ message: 'Successfully cancelled transaction' });
});

module.exports = BlockChainRouter;