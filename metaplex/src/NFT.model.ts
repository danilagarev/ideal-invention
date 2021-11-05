/* eslint-disable camelcase */
import type { AuctionState } from '@metaplex/js/lib/programs/auction';

export interface NFT {
  address: string;
}

// TODO @dkchv: replace with NFTModel
/**
 * @deprecated
 */
export interface NFTInfoModel {
  name: string;
  value: string;
}

export interface NFTModel {
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
  attributes: NFTAttributes[];
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
