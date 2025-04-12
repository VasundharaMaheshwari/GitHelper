import {
    createSolanaClient,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
    address,
    transactionToBase64WithSigners,
} from "gill";

import { loadKeypairSignerFromEnvironment } from "gill/node";

import {
    TOKEN_2022_PROGRAM_ADDRESS,
    buildTransferTokensTransaction,
    buildMintTokensTransaction,
    getAssociatedTokenAccountAddress
} from "gill/programs/token";

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "https://api.devnet.solana.com",
});

export const checkDeployerBalance = async () => {
    const deployer = await loadKeypairSignerFromEnvironment("DEPLOYER");
    const mint = await loadKeypairSignerFromEnvironment("MINT");

    const sourceAta = await getAssociatedTokenAccountAddress(
        mint,
        deployer,
        TOKEN_2022_PROGRAM_ADDRESS,
    );
    const { value: updatedBalance } = await rpc
        .getTokenAccountBalance(sourceAta)
        .send();

    return updatedBalance;
};

export const checkUserBalance = async (user: string) => {
    const mint = await loadKeypairSignerFromEnvironment("MINT");

    const destinationAta = await getAssociatedTokenAccountAddress(
        mint,
        address(user),
        TOKEN_2022_PROGRAM_ADDRESS,
    );

    const { value: destinationWalletBalance } = await rpc
        .getTokenAccountBalance(destinationAta)
        .send();

    return destinationWalletBalance;
};

export const mintTokens = async (amt: number) => {
    const deployer = await loadKeypairSignerFromEnvironment("DEPLOYER");
    const mint = await loadKeypairSignerFromEnvironment("MINT");

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

    await sendAndConfirmTransaction(signedSendTokensTx);

    return { sendTokensTxSignature };
};

export const claimTokens = async (user: string, amt: number) => {
    const deployer = await loadKeypairSignerFromEnvironment("DEPLOYER");
    const mint = await loadKeypairSignerFromEnvironment("MINT");

    const sourceBalance = await checkDeployerBalance();

    if (Number(sourceBalance.amount) < amt) {
        const mintAmt = amt - Number(sourceBalance.amount);
        await mintTokens(mintAmt);
    }

    let { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

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
    return { transferTokensTxSignature };
};

import { createTransaction } from "gill";
import { getTransferInstruction } from "gill/programs/token";

export const redeemRewards = async (user: string, amt: number) => {
    const deployer = await loadKeypairSignerFromEnvironment("DEPLOYER");
    const mint = await loadKeypairSignerFromEnvironment("MINT");

    const destinationAta = await getAssociatedTokenAccountAddress(
        mint,
        deployer,
        TOKEN_2022_PROGRAM_ADDRESS,
    );

    const sourceAta = await getAssociatedTokenAccountAddress(
        mint,
        address(user),
        TOKEN_2022_PROGRAM_ADDRESS,
    );

    const senderBalance = await checkUserBalance(user);

    if (Number(senderBalance.amount) < amt) {
        throw new Error('Insufficient Balance');
    }

    let { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const transaction = createTransaction({
        feePayer: address(user),
        version: "legacy",
        instructions: [
            getTransferInstruction(
                {
                    source: sourceAta,
                    authority: address(user),
                    destination: destinationAta,
                    amount: amt,
                },
                { programAddress: TOKEN_2022_PROGRAM_ADDRESS },
            ),
        ],
        latestBlockhash,
    });

    const finalTransaction = await transactionToBase64WithSigners(transaction);

    return finalTransaction;
};

import { getExplorerLink } from "gill";

export const confirmTransaction = async (transaction: string) => {
    const link: string = getExplorerLink({
        transaction
    });

    if (link) return true;

    return false;
}