import {
    generateKeyPairSigner,
    createSolanaClient,
    KeyPairSigner,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
    LAMPORTS_PER_SOL,
    lamports,
    generateExtractableKeyPairSigner,
} from "gill";

import { saveKeypairSignerToFile } from "gill/node";

import {
    buildCreateTokenTransaction,
    TOKEN_2022_PROGRAM_ADDRESS,
    buildMintTokensTransaction,
} from "gill/programs/token";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "http://127.0.0.1:8899",
});

const main = async () => {
    const deployer = await generateExtractableKeyPairSigner();
    console.log("DEPLOYER: ", deployer.address);
    await saveKeypairSignerToFile(deployer, "deployer.json");
    const mint = await generateExtractableKeyPairSigner();
    console.log("MINT: ", mint.address);

    await rpc
        .requestAirdrop(deployer.address, lamports(BigInt(LAMPORTS_PER_SOL)))
        .send();

    await sleep(2000);

    let { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const createTokenTx = await buildCreateTokenTransaction({
        feePayer: deployer,
        latestBlockhash,
        mint,
        // mintAuthority, // default=same as the `feePayer`
        metadata: {
            isMutable: true, // if the `updateAuthority` can change this metadata in the future
            name: "GitHelper",
            symbol: "GHELP",
            uri: "https://raw.githubusercontent.com/crabbyjumping/bhikaribabakijay/refs/heads/main/metadata.json",
        },
        // updateAuthority, // default=same as the `feePayer`
        decimals: 2,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    });

    const signedTokenTx = await signTransactionMessageWithSigners(
        createTokenTx
    );

    const tokenTxSignature: string = getSignatureFromTransaction(signedTokenTx);

    console.log("CREATE TRANSACTION: ", tokenTxSignature);

    await sendAndConfirmTransaction(signedTokenTx);

    ({ value: latestBlockhash } = await rpc.getLatestBlockhash().send());

    const sendTokensTx = await buildMintTokensTransaction({
        feePayer: deployer,
        latestBlockhash,
        mint,
        mintAuthority: deployer,
        amount: 100000, // note: be sure to consider the mint's `decimals` value
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

    console.log("SEND TRANSACTION: ", sendTokensTxSignature);

    await sendAndConfirmTransaction(signedSendTokensTx);
};

main();
