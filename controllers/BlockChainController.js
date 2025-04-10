const { Wallet } = require('../models/Wallet');

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

module.exports = { connectWallet };