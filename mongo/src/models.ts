import {createConnection, Schema} from "mongoose";

/* eslint-disable camelcase */
import type { AuctionState } from '@metaplex/js/lib/programs/auction';

export interface AuctionManagerDB {
  auction: string; // auction.pubkey
  manager: string; // manager.pubkey
  seller: string; // seller.pubkey
  safetyBox: string; // auction.pubkey
  vault: string; // vault.pubkey
  metadata: {
    name: string;
    url: string;
    symbol: string;
  };
  price: string; // auction.data.priceFloor.minPrice
  state: AuctionState;
  auctionTokenMint: string; // auction.data.tokenMint = SOL
  details: NFTDetails; // from uri (JSON)
}

// NFT Details can be fetched from {NFTModel.url}
// example: https://arweave.net/uQxrjzQZ2zj1j1mSPsTtNLYc5GpInoT6Gdc2gWutYyc
export interface NFTDetails {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  external_url: string;
  properties: NFTDetailProperties;
  attributes: NFTAttributes[] | undefined;
}

export interface NFTDetailFile {
  uri: string;
  type: string;
}

export interface NFTCreator {
  address: string;
  share: number;
}

export interface NFTDetailProperties {
  files: NFTDetailFile[];
  category: 'image' | string;
  creators: NFTCreator[];
}

export interface NFTAttributes {
  trait_type: string;
  value: string | number;
}


// Schema
const NFTDetailsSchema = new Schema<NFTDetails>({
  name: String,
  symbol: String,
  description: String,
  seller_fee_basis_points: Number,
  image: String,
  external_url: String,
  properties: {
    files: [{
        uri: String,
        type: String
      }],
    category: String,
    creators: [{
        address: String,
        share: Number
      }]
  },
  attributes: [{
      trait_type: String,
      value: String
    }],
}, {typeKey: '$type'});

const AuctionManagerSchema = new Schema<AuctionManagerDB>({
  auction: { type: String, required: true },
  seller: { type: String, required: true },
  manager: { type: String, required: true },
  safetyBox: { type: String, required: true },
  vault: { type: String, required: true },
  metadata: {
    name: String,
    url: String,
    symbol: String
  },
  price: { type: String, required: true },
  state: { type: Number, required: true },
  auctionTokenMint: { type: String, required: true },
  details: { type: NFTDetailsSchema, required: true },
});

// const tokenSwapSchema = new Schema(
//   {
//     version: Number,
//     isInitialized: Boolean,
//     nonce: Number,
//     tokenProgramId: String,
//     tokenAccountA: Schema.Types.Mixed,
//     tokenAccountB: Schema.Types.Mixed,
//     tokenPool: String,
//     mintA: String,
//     mintB: String,
//     feeAccount: String,
//     tradeFeeNumerator: Number,
//     tradeFeeDenominator: Number,
//     ownerTradeFeeNumerator: Number,
//     ownerTradeFeeDenominator: Number,
//     ownerWithdrawFeeNumerator: Number,
//     ownerWithdrawFeeDenominator: Number,
//     hostFeeNumerator: Number,
//     hostFeeDenominator: Number,
//     curveType: Number,
//     curveParameters: Buffer
//   },
//   {
//     typeKey: "$type",
//     strict: false
//   });

const tokenSwapSchema = new Schema(
  {
    programID: String
  },
  {
    typeKey: "$type",
    strict: false
  });

const switcherSchema = new Schema(
  {
    readerTableName: String,
    writerTableName: String,
    serviceName: String,
  },
  {
    typeKey: "$type",
    strict: false
  });

const mongoHostname = process.env.MONGO_HOSTNAME || "localhost";

export const mongoUri = `mongodb://admin:test1234@${mongoHostname}:27017/`

const connection = createConnection(mongoUri);

export const AuctionManagerModel = connection.model('AuctionManager', AuctionManagerSchema);
export const AuctionReserveManagerModel = connection.model('AuctionReserveManager', AuctionManagerSchema);
export const TokenSwapModel = connection.model('TokenSwap', tokenSwapSchema);
export const TokenSwapReserveModel = connection.model('TokenSwapReserve', tokenSwapSchema);
export const SwitcherModel = connection.model('Switcher', switcherSchema);
