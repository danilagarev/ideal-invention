import {TokenSwapModel} from "../models";
import {Numberu64, TokenSwapLayout} from "@solana/spl-token-swap"
import {AccountInfo, PublicKey} from "@solana/web3.js"
import {connection} from "../../../metaplex/src/constants";


async function prepareTokenSwap(tokenSwapData: any, programID: string) {
  console.log(tokenSwapData)
  const tokenPool = new PublicKey(tokenSwapData.tokenPool).toBase58();
  const tokenProgramId = new PublicKey(tokenSwapData.tokenProgramId).toBase58();
  const feeAccount = new PublicKey(tokenSwapData.feeAccount).toBase58();
  const tokenAccountA = await connection.getParsedAccountInfo(new PublicKey(tokenSwapData.tokenAccountA));
  const tokenAccountB = await connection.getParsedAccountInfo(new PublicKey(tokenSwapData.tokenAccountB));
  const mintA = new PublicKey(tokenSwapData.mintA).toBase58();
  const mintB = new PublicKey(tokenSwapData.mintB).toBase58();

  const tradeFeeNumerator = Numberu64.fromBuffer(
    tokenSwapData.tradeFeeNumerator,
  ).toNumber();
  const tradeFeeDenominator = Numberu64.fromBuffer(
    tokenSwapData.tradeFeeDenominator,
  ).toNumber();
  const ownerTradeFeeNumerator = Numberu64.fromBuffer(
    tokenSwapData.ownerTradeFeeNumerator,
  ).toNumber();
  const ownerTradeFeeDenominator = Numberu64.fromBuffer(
    tokenSwapData.ownerTradeFeeDenominator,
  ).toNumber();
  const ownerWithdrawFeeNumerator = Numberu64.fromBuffer(
    tokenSwapData.ownerWithdrawFeeNumerator,
  ).toNumber();
  const ownerWithdrawFeeDenominator = Numberu64.fromBuffer(
    tokenSwapData.ownerWithdrawFeeDenominator,
  ).toNumber();
  const hostFeeNumerator = Numberu64.fromBuffer(
    tokenSwapData.hostFeeNumerator,
  ).toNumber();
  const hostFeeDenominator = Numberu64.fromBuffer(
    tokenSwapData.hostFeeDenominator,
  ).toNumber();
  const version = tokenSwapData.version;
  const isInitialized = Boolean(tokenSwapData.isInitialized);
  const nonce = tokenSwapData.nonce;
  const curveType = tokenSwapData.curveType;
  const curveParameters = tokenSwapData.curveParameters;

  return {
    version,
    isInitialized,
    nonce,
    tokenProgramId,
    tokenAccountA,
    tokenAccountB,
    tokenPool,
    mintA,
    mintB,
    feeAccount,
    tradeFeeNumerator,
    tradeFeeDenominator,
    ownerTradeFeeNumerator,
    ownerTradeFeeDenominator,
    ownerWithdrawFeeNumerator,
    ownerWithdrawFeeDenominator,
    hostFeeNumerator,
    hostFeeDenominator,
    curveType,
    curveParameters,
    programID
  }
}

async function prepareTokenSwap2(tokenSwapData: any, programID: string){
  tokenSwapData.tokenAccountA = await connection.getParsedAccountInfo(new PublicKey(tokenSwapData.tokenAccountA));
  tokenSwapData.tokenAccountB = await connection.getParsedAccountInfo(new PublicKey(tokenSwapData.tokenAccountB));
  tokenSwapData.programID = programID;
  return tokenSwapData;
}

export async function saveAllTokenSwap(accounts: Array<{account: AccountInfo<Buffer>, pubkey: PublicKey}>, programID: string) {
  const promises = accounts.map(item => prepareTokenSwap(TokenSwapLayout.decode(Buffer.from(item.account.data)), programID));
  const tokenSwap = await Promise.all(promises);
  // console.log(tokenSwap);
  await TokenSwapModel.insertMany(tokenSwap);
}

export async function getAllTokenSwaps(programID: string) {
  return TokenSwapModel.find({programID: programID});
}