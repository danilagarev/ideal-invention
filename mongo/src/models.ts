import {createConnection, Schema} from "mongoose";

/* eslint-disable camelcase */
import type { AuctionState } from '@metaplex/js/lib/programs/auction';

export interface AuctionDB {
  address: string; // auction.pubkey
  metadata: {
    name: string;
    url: string;
    symbol: string;
  };
  price: string; // auction.data.priceFloor.minPrice
  state: AuctionState;
  vaultPublicKey: string;
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
  name: {type: String, required: false},
  symbol: {type: String, required: false},
  description: {type: String, required: false},
  seller_fee_basis_points: {type: Number, required: false},
  image: {type: String, required: false},
  external_url: {type: String, required: false},
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

const AuctionSchema = new Schema<AuctionDB>({
  address: { type: String, required: true },
  metadata: {
    name: String,
    url: String,
    symbol: String
  },
  price: { type: String, required: true },
  state: { type: Number, required: true },
  vaultPublicKey: { type: String, required: true },
  auctionTokenMint: { type: String, required: true },
  details: { type: NFTDetailsSchema, required: true },
});

const mongoHostname = process.env.MONGO_HOSTNAME || "localhost";

export const mongoUri = `mongodb://admin:test1234@${mongoHostname}:27017/`

const connection = createConnection(mongoUri);

export const AuctionModel = connection.model('Auction', AuctionSchema);
