const express = require('express');
const { connectWallet, displayWallet } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');
const { claimTokens } = require('../services/claim');
const { Wallet } = require('../models/Wallet');
const { GHUser } = require('../models/GHUser');
const ms = require('ms');
const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletNotConnected, connectWallet);

function convertPointsToTokenUnits(points) {
  const unitsPerToken = 1e9;
  const pointsPerToken = 200;
  const unitsPerPoint = unitsPerToken / pointsPerToken;

  const tokenUnits = points * unitsPerPoint;
  return tokenUnits;
}

BlockChainRouter.post('/claim', walletConnected, async (req, res) => {
  try {
    const { pointsClaimed } = req.body;
    const amt = convertPointsToTokenUnits(pointsClaimed);

    const userCheck = await GHUser.findById(req.user._id);

    if (userCheck.balance < pointsClaimed) return res.status(400).redirect('/error?error_details=Insufficient_Balance');

    if (Date.now() - new Date(userCheck.lastRedeem) < ms('24h')) return res.status(400).redirect('/error?error_details=Claim_Allowed_Only_Once_Per_Day');

    const user = await Wallet.findOne({ userID: req.user._id });

    await claimTokens(user.walletAddress, amt);

    await GHUser.findByIdAndUpdate(req.user._id, { $inc: { balance: -pointsClaimed }, lastRedeem: new Date() });

    return res.status(200).redirect('/points/wallet-display');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  };
});

//temporary

// BlockChainRouter.get('/redeem', (req, res) => {
//   return res.render('redeem.hbs');
// });

module.exports = BlockChainRouter;