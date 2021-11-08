import {
  TokenSwapModel,
  TokenSwapReserveModel
} from "../models";
import {Numberu64, TokenSwapLayout} from "@solana/spl-token-swap"
import {AccountInfo, ParsedAccountData, PublicKey} from "@solana/web3.js"
import {connection} from "../../../metaplex/src/constants";
import {dbSwitcher} from "../switcher_utils";
import {Buffer} from "buffer";

class TokenAccount {
  account: AccountInfo<Buffer | ParsedAccountData>;
  pubkey: string;
  constructor(account: any, // TODO: fix type later
              pubkey: string) {
    this.account = account;
    this.pubkey = pubkey;
  }
}

async function prepareTokenSwap(tokenSwapData: any,
                                programID: string,
                                pubkey: string) {
  const tokenPool = new PublicKey(tokenSwapData.tokenPool).toBase58();
  const tokenProgramId = new PublicKey(tokenSwapData.tokenProgramId).toBase58();
  const feeAccount = new PublicKey(tokenSwapData.feeAccount).toBase58();
  const tokenAccountA = new TokenAccount(
    await connection.getParsedAccountInfo(new PublicKey(tokenSwapData.tokenAccountA)),
    new PublicKey(tokenSwapData.tokenAccountA).toBase58());
  const tokenAccountB = new TokenAccount(
    await connection.getParsedAccountInfo(new PublicKey(tokenSwapData.tokenAccountB)),
    new PublicKey(tokenSwapData.tokenAccountB).toBase58()
    );
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
    pubkey,
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

export async function saveAllTokenSwap(accounts: Array<{
  account: AccountInfo<Buffer>,
  pubkey: PublicKey
}>, programID: string): Promise<void> {
  const promises = accounts.map(item => prepareTokenSwap(
    TokenSwapLayout.decode(Buffer.from(item.account.data)),
    programID,
    item.pubkey.toBase58()
    ));
  const tokenSwap = await Promise.all(promises);
  const switcher = await dbSwitcher.getMainTable('tokenSwap');
  console.log("switcher", switcher)
  let model;
  // @ts-ignore
  switch (switcher.writerTableName) {
    case 'TokenSwap':
      model = TokenSwapModel;
      break;
    case 'TokenSwapReserve':
      model = TokenSwapReserveModel;
      break;
  }
  console.log(model)
  if (model) {
    await model.insertMany(tokenSwap);
  } else {
    console.log("Model from the switcher not found")
  }
}

export async function getAllTokenSwaps(programID: string): Promise<any> {
  const switcher = await dbSwitcher.getMainTable('tokenSwap');
  console.log("switcher", switcher)
  let model;
  // @ts-ignore
  switch (switcher.readerTableName) {
    case 'TokenSwap':
      model = TokenSwapModel;
      break;
    case 'TokenSwapReserve':
      model = TokenSwapReserveModel;
      break;
  }
  console.log(model)
  if (model) {
    return model.find({programID: programID}, {_id: 0});
  } else {
    console.log("Model from the the switcher not found")
  }
}