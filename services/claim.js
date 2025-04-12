'use strict';
let __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator['throw'](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
let __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
  return g.next = verb(0), g['throw'] = verb(1), g['return'] = verb(2), typeof Symbol === 'function' && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.');
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
      case 0: case 1: t = op; break;
      case 4: _.label++; return { value: op[1], done: false };
      case 5: _.label++; y = op[1]; op = [0]; continue;
      case 7: op = _.ops.pop(); _.trys.pop(); continue;
      default:
        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
        if (t[2]) _.ops.pop();
        _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.confirmTransaction = exports.redeemRewards = exports.claimTokens = exports.mintTokens = exports.checkUserBalance = exports.checkDeployerBalance = void 0;
let gill_1 = require('gill');
let node_1 = require('gill/node');
let token_1 = require('gill/programs/token');
let _a = (0, gill_1.createSolanaClient)({
    urlOrMoniker: 'https://api.devnet.solana.com',
  }), rpc = _a.rpc, sendAndConfirmTransaction = _a.sendAndConfirmTransaction;
let checkDeployerBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
  let deployer, mint, sourceAta, updatedBalance;
  return __generator(this, function (_a) {
    switch (_a.label) {
    case 0: return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('DEPLOYER')];
    case 1:
      deployer = _a.sent();
      return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('MINT')];
    case 2:
      mint = _a.sent();
      return [4 /*yield*/, (0, token_1.getAssociatedTokenAccountAddress)(mint, deployer, token_1.TOKEN_2022_PROGRAM_ADDRESS)];
    case 3:
      sourceAta = _a.sent();
      return [4 /*yield*/, rpc
        .getTokenAccountBalance(sourceAta)
        .send()];
    case 4:
      updatedBalance = (_a.sent()).value;
      return [2 /*return*/, updatedBalance];
    }
  });
}); };
exports.checkDeployerBalance = checkDeployerBalance;
let checkUserBalance = function (user) { return __awaiter(void 0, void 0, void 0, function () {
  let mint, destinationAta, destinationWalletBalance;
  return __generator(this, function (_a) {
    switch (_a.label) {
    case 0: return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('MINT')];
    case 1:
      mint = _a.sent();
      return [4 /*yield*/, (0, token_1.getAssociatedTokenAccountAddress)(mint, (0, gill_1.address)(user), token_1.TOKEN_2022_PROGRAM_ADDRESS)];
    case 2:
      destinationAta = _a.sent();
      return [4 /*yield*/, rpc
        .getTokenAccountBalance(destinationAta)
        .send()];
    case 3:
      destinationWalletBalance = (_a.sent()).value;
      return [2 /*return*/, destinationWalletBalance];
    }
  });
}); };
exports.checkUserBalance = checkUserBalance;
let mintTokens = function (amt) { return __awaiter(void 0, void 0, void 0, function () {
  let deployer, mint, latestBlockhash, sendTokensTx, signedSendTokensTx, sendTokensTxSignature;
  return __generator(this, function (_a) {
    switch (_a.label) {
    case 0: return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('DEPLOYER')];
    case 1:
      deployer = _a.sent();
      return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('MINT')];
    case 2:
      mint = _a.sent();
      return [4 /*yield*/, rpc.getLatestBlockhash().send()];
    case 3:
      latestBlockhash = (_a.sent()).value;
      return [4 /*yield*/, (0, token_1.buildMintTokensTransaction)({
        feePayer: deployer,
        latestBlockhash: latestBlockhash,
        mint: mint,
        mintAuthority: deployer,
        // amount: 100000, // note: be sure to consider the mint's `decimals` value
        amount: amt,
        // if decimals=2 => this will mint 10.00 tokens
        // if decimals=4 => this will mint 0.100 tokens
        destination: deployer,
        // use the correct token program for the `mint`
        tokenProgram: token_1.TOKEN_2022_PROGRAM_ADDRESS, // default=TOKEN_PROGRAM_ADDRESS
      })];
    case 4:
      sendTokensTx = _a.sent();
      return [4 /*yield*/, (0, gill_1.signTransactionMessageWithSigners)(sendTokensTx)];
    case 5:
      signedSendTokensTx = _a.sent();
      return [4 /*yield*/, (0, gill_1.getSignatureFromTransaction)(signedSendTokensTx)];
    case 6:
      sendTokensTxSignature = _a.sent();
      return [4 /*yield*/, sendAndConfirmTransaction(signedSendTokensTx)];
    case 7:
      _a.sent();
      return [2 /*return*/, { sendTokensTxSignature: sendTokensTxSignature }];
    }
  });
}); };
exports.mintTokens = mintTokens;
let claimTokens = function (user, amt) { return __awaiter(void 0, void 0, void 0, function () {
  let deployer, mint, sourceBalance, mintAmt, latestBlockhash, transferTokensTx, signedTransferTokensTx, transferTokensTxSignature;
  return __generator(this, function (_a) {
    switch (_a.label) {
    case 0: return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('DEPLOYER')];
    case 1:
      deployer = _a.sent();
      return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('MINT')];
    case 2:
      mint = _a.sent();
      return [4 /*yield*/, (0, exports.checkDeployerBalance)()];
    case 3:
      sourceBalance = _a.sent();
      if (!(Number(sourceBalance.amount) < amt)) return [3 /*break*/, 5];
      mintAmt = amt - Number(sourceBalance.amount);
      return [4 /*yield*/, (0, exports.mintTokens)(mintAmt)];
    case 4:
      _a.sent();
      _a.label = 5;
    case 5: return [4 /*yield*/, rpc.getLatestBlockhash().send()];
    case 6:
      latestBlockhash = (_a.sent()).value;
      return [4 /*yield*/, (0, token_1.buildTransferTokensTransaction)({
        feePayer: deployer, //bos
        latestBlockhash: latestBlockhash,
        mint: mint, //mnt
        authority: deployer, //bos
        // amount: 100000, // note: be sure to consider the mint's `decimals` value
        amount: amt,
        destination: (0, gill_1.address)(user),
        // use the correct token program for the `mint`
        tokenProgram: token_1.TOKEN_2022_PROGRAM_ADDRESS, // default=TOKEN_PROGRAM_ADDRESS
      })];
    case 7:
      transferTokensTx = _a.sent();
      return [4 /*yield*/, (0, gill_1.signTransactionMessageWithSigners)(transferTokensTx)];
    case 8:
      signedTransferTokensTx = _a.sent();
      return [4 /*yield*/, (0, gill_1.getSignatureFromTransaction)(signedTransferTokensTx)];
    case 9:
      transferTokensTxSignature = _a.sent();
      // console.log("TRANSFER TRANSACTION: ", transferTokensTxSignature);
      return [4 /*yield*/, sendAndConfirmTransaction(signedTransferTokensTx)];
    case 10:
      // console.log("TRANSFER TRANSACTION: ", transferTokensTxSignature);
      _a.sent();
      return [2 /*return*/, { transferTokensTxSignature: transferTokensTxSignature }];
    }
  });
}); };
exports.claimTokens = claimTokens;
let gill_2 = require('gill');
let token_2 = require('gill/programs/token');
let redeemRewards = function (user, amt) { return __awaiter(void 0, void 0, void 0, function () {
  let deployer, mint, destinationAta, sourceAta, senderBalance, latestBlockhash, transaction, finalTransaction;
  return __generator(this, function (_a) {
    switch (_a.label) {
    case 0: return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('DEPLOYER')];
    case 1:
      deployer = _a.sent();
      return [4 /*yield*/, (0, node_1.loadKeypairSignerFromEnvironment)('MINT')];
    case 2:
      mint = _a.sent();
      return [4 /*yield*/, (0, token_1.getAssociatedTokenAccountAddress)(mint, deployer, token_1.TOKEN_2022_PROGRAM_ADDRESS)];
    case 3:
      destinationAta = _a.sent();
      return [4 /*yield*/, (0, token_1.getAssociatedTokenAccountAddress)(mint, (0, gill_1.address)(user), token_1.TOKEN_2022_PROGRAM_ADDRESS)];
    case 4:
      sourceAta = _a.sent();
      return [4 /*yield*/, (0, exports.checkUserBalance)(user)];
    case 5:
      senderBalance = _a.sent();
      if (Number(senderBalance.amount) < amt) {
        throw new Error('Insufficient Balance');
      }
      return [4 /*yield*/, rpc.getLatestBlockhash().send()];
    case 6:
      latestBlockhash = (_a.sent()).value;
      transaction = (0, gill_2.createTransaction)({
        feePayer: (0, gill_1.address)(user),
        version: 'legacy',
        instructions: [
          (0, token_2.getTransferInstruction)({
            source: sourceAta,
            authority: (0, gill_1.address)(user),
            destination: destinationAta,
            amount: amt,
          }, { programAddress: token_1.TOKEN_2022_PROGRAM_ADDRESS }),
        ],
        latestBlockhash: latestBlockhash,
      });
      return [4 /*yield*/, (0, gill_1.transactionToBase64WithSigners)(transaction)];
    case 7:
      finalTransaction = _a.sent();
      return [2 /*return*/, finalTransaction];
    }
  });
}); };
exports.redeemRewards = redeemRewards;
let gill_3 = require('gill');
let confirmTransaction = function (transaction) { return __awaiter(void 0, void 0, void 0, function () {
  let link;
  return __generator(this, function (_a) {
    link = (0, gill_3.getExplorerLink)({
      transaction: transaction
    });
    if (link)
      return [2 /*return*/, true];
    return [2 /*return*/, false];
  });
}); };
exports.confirmTransaction = confirmTransaction;
