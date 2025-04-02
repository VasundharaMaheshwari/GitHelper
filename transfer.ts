import {
    createSolanaClient,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
    generateKeyPairSigner,
} from "gill";

import { loadKeypairSignerFromFile } from "gill/node";

import {
    TOKEN_2022_PROGRAM_ADDRESS,
    buildTransferTokensTransaction,
} from "gill/programs/token";

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "http://127.0.0.1:8899",
});

const main = async () => {
    const user = await generateKeyPairSigner();
    console.log("USER: ", user.address);

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const deployer = await loadKeypairSignerFromFile("deployer.json");
    const mint = await loadKeypairSignerFromFile("mint.json");

    const transferTokensTx = await buildTransferTokensTransaction({
        feePayer: deployer,
        latestBlockhash,
        mint,
        authority: deployer,
        amount: 900, // note: be sure to consider the mint's `decimals` value
        destination: user,
        // use the correct token program for the `mint`
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS, // default=TOKEN_PROGRAM_ADDRESS
    });

    const signedTransferTokensTx = await signTransactionMessageWithSigners(
        transferTokensTx
    );
    const transferTokensTxSignature = await getSignatureFromTransaction(
        signedTransferTokensTx
    );
    console.log("TRANSFER TRANSACTION: ", transferTokensTxSignature);

    await sendAndConfirmTransaction(signedTransferTokensTx);
};

main();
