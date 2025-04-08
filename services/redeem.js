const {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} = require('@solana/web3.js');
const {
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');
const { checkUserBalance } = require('./claim');

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

require('dotenv').config();

const MINT_ADDRESS = new PublicKey(process.env.MINT_ADDRESS);
const RECEIVER_PUBLIC_KEY = new PublicKey(process.env.DEPLOYER_ADDRESS); // your app's wallet

const redeem = async (req, res) => {
  try {
    const { sender, amt } = req.body;
    const senderPublicKey = new PublicKey(sender);

    const senderBalance = await checkUserBalance(sender);

    if (Number(senderBalance.amount) < amt) {
      return res.status(500).json({ error: 'Insufficient Balance' });
    }

    const senderTokenAccount = await getAssociatedTokenAddressSync(
      MINT_ADDRESS,
      senderPublicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const receiverTokenAccount = await getAssociatedTokenAddressSync(
      MINT_ADDRESS,
      RECEIVER_PUBLIC_KEY,
      true,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const ix = createTransferInstruction(
      senderTokenAccount,
      receiverTokenAccount,
      senderPublicKey,
      amt, // amount (adjust decimals accordingly)
      [],
      TOKEN_2022_PROGRAM_ID
    );

    const tx = new Transaction().add(ix);
    tx.feePayer = senderPublicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const serialized = tx.serialize({
      requireAllSignatures: false, // Let Phantom sign
    });

    const base64Tx = serialized.toString('base64');
    res.json({ transaction: base64Tx });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { redeem };