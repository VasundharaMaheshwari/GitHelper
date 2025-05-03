const { GHUser } = require('../models/GHUser');
const { Wallet } = require('../models/Wallet');
const { redeemRewards, confirmTransaction, checkUserBalance, claimTokens } = require('../services/claim');
const { ObjectId } = require('mongodb');
const { Issue } = require('../models/Issue');
const ms = require('ms');
const { validationResult } = require('express-validator');

//add disconnect wallet, profile picture, emails for edits and acceptance and approval and close reports, logging of login and activities with ip and user, seo, gemini based decriptions and reports checking, chat features of delete and pin, close query instead of delete and have a history page of that, feedback of work and reports status

const connectWallet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { walletAddress } = req.body;
      const unavailable = await Wallet.findOne({ $or: [{ walletAddress }, { userID: req.user._id }] });

      if (unavailable) return res.status(400).redirect('/error?error_details=Wallet_Already_Linked');

      const newWallet = new Wallet({ walletAddress, userID: req.user._id });
      await newWallet.save();

      return res.status(200).redirect('/points/wallet-display');
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  };
};

const displayWallet = async (req, res) => {
  try {
    const user = await GHUser.findById(req.user._id);

    if (!user) return res.status(400).redirect('/error?error_details=User_Not_Found');

    const wallet = await Wallet.findOne({ userID: req.user._id });

    if (!wallet) return res.status(400).redirect('/error?error_details=Wallet_Not_Found');

    let userBalance = {};
    try {
      userBalance = await checkUserBalance(wallet.walletAddress);
    } catch (error) {
      if (
        error.message.includes('Solana error') ||
        error.message.includes('could not find account') ||
        error.message.includes('Invalid method parameter')
      ) {
        userBalance.uiAmount = '--.--';
      } else {
        throw error; // Re-throw if it's some other error
      }
    };
    return res.status(200).render('main.hbs', {
      layout: 'walletBalance.hbs',
      balance: user.balance,
      walletBalance: userBalance.uiAmount
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  };
};

function convertPointsToTokenUnits(points) {
  const unitsPerToken = 1e9;
  const pointsPerToken = 200;
  const unitsPerPoint = unitsPerToken / pointsPerToken;

  const tokenUnits = points * unitsPerPoint;
  return tokenUnits;
}

const tokenConversion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { pointsClaimed } = req.body;
      const amt = convertPointsToTokenUnits(pointsClaimed);

      const userCheck = await GHUser.findById(req.user._id);

      if (userCheck.balance < pointsClaimed) return res.status(400).redirect('/error?error_details=Insufficient_Balance');

      if (Date.now() - new Date(userCheck.lastRedeem) < ms('24h')) return res.status(400).redirect('/error?error_details=Claim_Allowed_Only_Once_Per_Day');

      const user = await Wallet.findOne({ userID: req.user._id });

      if (!user) return res.status(400).redirect('/error?error_details=Wallet_Address_Not_Found');

      await GHUser.findByIdAndUpdate(req.user._id, { $inc: { balance: -pointsClaimed }, lastRedeem: new Date() });

      await claimTokens(user.walletAddress, amt); //add revert

      return res.status(200).redirect('/points/wallet-display');
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  };
};

const pushRequests = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { sender, queryId } = req.body;
      const queryCheck = await Issue.findOne({ _id: queryId, createdBy: req.user._id, priority: 0 });
      if (!ObjectId.isValid(queryId) || !queryCheck) return res.json({ message: 'Valid Query Not Found' });

      const walletCheck = await Wallet.findOne({ userID: req.user._id, walletAddress: sender });

      if (!walletCheck) return res.json({ message: 'Wallet Not Found' });

      let transaction;
      try {
        await Issue.findByIdAndUpdate(queryId, { inProgress: true });
        transaction = await redeemRewards(sender, 5 * 1e9);
      } catch {
        return res.json({ message: 'Insufficient Balance' });
      }
      return res.json({ transaction });
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).send('Internal Server Error');
  }
};

const confirmed = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { transaction, queryId } = req.body;
      if (await confirmTransaction(transaction) && ObjectId.isValid(queryId)) {
        await Issue.findOneAndUpdate({ _id: queryId, inProgress: true, priority: 0 }, { priority: 1, inProgress: false });
        return res.json({ message: 'Successfully updated' });
      }
      return res.status(404).json({ message: 'Failed to update' });
    }
    return res.status(400).json({ message: 'Failed to update' });
  } catch {
    return res.status(500).send('Internal Server Error');
  };
};

const rejected = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { queryId } = req.body;
      if (ObjectId.isValid(queryId)) {
        await Issue.findOneAndUpdate({ _id: queryId, inProgress: true, priority: 0 }, { inProgress: false });
        return res.json({ message: 'Successfully cancelled transaction' });
      }
      return res.status(404).json({ message: 'Failed to revert' });
    }
    return res.status(400).json({ message: 'Failed to revert' });
  } catch {
    return res.status(500).send('Internal Server Error');
  };
};

module.exports = { connectWallet, displayWallet, tokenConversion, pushRequests, confirmed, rejected };