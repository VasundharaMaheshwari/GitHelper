import {
    createSolanaClient,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
    address,
    StringifiedBigInt,
} from "gill";

import { loadKeypairSignerFromFile } from "gill/node";

import {
    TOKEN_2022_PROGRAM_ADDRESS,
    buildTransferTokensTransaction,
    buildMintTokensTransaction
} from "gill/programs/token";

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "https://api.devnet.solana.com",
});

export const main = async (user: string, amt: number) => {
    const deployer = await loadKeypairSignerFromFile("bosnrvc58UhxDbFb3dnjZ9rpQtepfncDmwQwCZPfd7b.json");
    const mint = await loadKeypairSignerFromFile("mntNcRwhpaBPUGggG1c4os4ZSKqpZTPWMHWWQnR6WKy.json");
    // const user = "Ht4KM3ujghGbCMay4aE2fXpp2Dhks2iKaSrFe7Wjd71q";
    // console.log("USER: ", user.address);

    let { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const sendTokensTx = await buildMintTokensTransaction({
        feePayer: deployer,
        latestBlockhash,
        mint,
        mintAuthority: deployer,
        // amount: 100000, // note: be sure to consider the mint's `decimals` value
        amount: amt,
        // if decimals=2 => this will mint 10.00 tokens
        // if decimals=4 => this will mint 0.100 tokens
        destination: deployer,
        // use the correct token program for the `mint`
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS, // default=TOKEN_PROGRAM_ADDRESS
    });

    const signedSendTokensTx = await signTransactionMessageWithSigners(
        sendTokensTx
    );

    const sendTokensTxSignature = await getSignatureFromTransaction(
        signedSendTokensTx
    );

    // console.log("SEND TRANSACTION: ", sendTokensTxSignature);

    await sendAndConfirmTransaction(signedSendTokensTx);

    const transferTokensTx = await buildTransferTokensTransaction({
        feePayer: deployer, //bos
        latestBlockhash,
        mint,//mnt
        authority: deployer,//bos
        // amount: 100000, // note: be sure to consider the mint's `decimals` value
        amount: amt,
        destination: address(user),
        // use the correct token program for the `mint`
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS, // default=TOKEN_PROGRAM_ADDRESS
    });

    const signedTransferTokensTx = await signTransactionMessageWithSigners(
        transferTokensTx
    );
    const transferTokensTxSignature = await getSignatureFromTransaction(
        signedTransferTokensTx
    );
    // console.log("TRANSFER TRANSACTION: ", transferTokensTxSignature);

    await sendAndConfirmTransaction(signedTransferTokensTx);

    return { transferTokensTxSignature, sendTokensTxSignature };
};

// main();