const { GHUser } = require('../models/GHUser');
const { Wallet } = require('../models/Wallet');
const { checkUserBalance } = require('../services/claim');
const { claimTokens } = require('../services/claim');
const ms = require('ms');

const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const unavailable = await Wallet.findOne({ $or: [{ walletAddress }, { userID: req.user._id }] });

    if (unavailable) return res.status(400).redirect('/error?error_details=Wallet_Already_Linked');

    const newWallet = new Wallet({ walletAddress, userID: req.user._id });
    await newWallet.save();

    return res.status(200).redirect('/points/wallet-display');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  };
};

const displayWallet = async (req, res) => {
  try {
    const user = await GHUser.findById(req.user._id);
    const wallet = await Wallet.findOne({ userID: req.user._id });
    let userBalance = {};
    try {
      userBalance = await checkUserBalance(wallet.walletAddress);
    } catch (error) {
      if (
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
};

module.exports = { connectWallet, displayWallet, tokenConversion };