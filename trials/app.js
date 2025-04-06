// server.js
const express = require('express');
const cors = require('cors');
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

const app = express();
app.use(cors());
app.use(express.json());

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const MINT_ADDRESS = new PublicKey('mntNcRwhpaBPUGggG1c4os4ZSKqpZTPWMHWWQnR6WKy');
const RECEIVER_PUBLIC_KEY = new PublicKey('bosnrvc58UhxDbFb3dnjZ9rpQtepfncDmwQwCZPfd7b'); // your app's wallet
// console.log(MINT_ADDRESS.toBase58());

app.post('/prepare-transaction', async (req, res) => {
  try {
    const { sender } = req.body;
    const senderPublicKey = new PublicKey(sender);

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
      100000, // amount (adjust decimals accordingly)
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
});

app.listen(3000, () => {
});
