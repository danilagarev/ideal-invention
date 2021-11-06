import {Connection, programs, StringPublicKey} from "@metaplex/js";
import * as BN from "bn.js"
import {PublicKey} from "@solana/web3.js";
import {BinaryReader, BinaryWriter, deserializeUnchecked, Schema} from "borsh";
import base58 = require("bs58");
const { metaplex: { Store, AuctionManager, StoreData }, metadata: { Metadata }, auction: { Auction }, vault: { Vault } } = programs;

async function getMeta(){
  const connection = new Connection("https://api.devnet.solana.com");
  const store = await Store.load(connection, '3ZvUMDt6JCEsnLSLZsyvgsxShqtK4AbJRcsjdGVLUNUp');
  const storeIndexer = (await PublicKey.findProgramAddress(
    [
      Buffer.from('metaplex'),
      new PublicKey("p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98").toBuffer(),
      new PublicKey('3ZvUMDt6JCEsnLSLZsyvgsxShqtK4AbJRcsjdGVLUNUp').toBuffer(),
      Buffer.from("index"),
      Buffer.from("0"),
    ],
    new PublicKey("p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"),
  ))[0]
  const storeIndxAcc = await connection.getAccountInfo(storeIndexer)
  console.log(store);
  console.log(storeIndexer.toString());
  if (storeIndxAcc) {
    const storeIndxerDes = deserializeUnchecked(SCHEMA, StoreIndexer, storeIndxAcc.data) as StoreIndexer;
    const auctionCache = await connection.getAccountInfo(new PublicKey(storeIndxerDes.auctionCaches[0]));
    if (auctionCache) {
      const auctionCacheDes = deserializeUnchecked(SCHEMA, AuctionCache, auctionCache?.data) as AuctionCache;
      console.log(auctionCacheDes)
      // Auction
      const auction = await Auction.load(connection, auctionCacheDes.auction);
      // Vault
      const vault = await Vault.load(connection, auctionCacheDes.vault);
      // Metaplex
      const auctionManager = await AuctionManager.load(connection, auctionCacheDes.auctionManager);
      const metadata = await Metadata.load(connection, auctionCacheDes.metadata[0]);

      console.log(auction)
      console.log(vault)
      console.log(auctionManager)
      console.log(metadata)
    }
    console.log(auctionCache?.data[0]);
  }
  // console.log(storeIndxAcc?.data[0]);
}

export class AuctionCache {
  key: MetaplexKey = MetaplexKey.AuctionCacheV1;
  store: StringPublicKey;
  timestamp: BN;
  metadata: StringPublicKey[];
  auction: StringPublicKey;
  vault: StringPublicKey;
  auctionManager: StringPublicKey;

  constructor(args: {
    store: StringPublicKey;
    timestamp: BN;
    metadata: StringPublicKey[];
    auction: StringPublicKey;
    vault: StringPublicKey;
    auctionManager: StringPublicKey;
  }) {
    this.key = MetaplexKey.AuctionCacheV1;
    this.store = args.store;
    this.timestamp = args.timestamp;
    this.metadata = args.metadata;
    this.auction = args.auction;
    this.vault = args.vault;
    this.auctionManager = args.auctionManager;
  }
}

export class StoreIndexer {
  key: MetaplexKey = MetaplexKey.StoreV1;
  store: StringPublicKey;
  page: BN;
  auctionCaches: StringPublicKey[];

  constructor(args: {
    store: StringPublicKey;
    page: BN;
    auctionCaches: StringPublicKey[];
  }) {
    this.key = MetaplexKey.StoreIndexerV1;
    this.store = args.store;
    this.page = args.page;
    this.auctionCaches = args.auctionCaches;
  }
}

export enum MetaplexKey {
  Uninitialized = 0,
  OriginalAuthorityLookupV1 = 1,
  BidRedemptionTicketV1 = 2,
  StoreV1 = 3,
  WhitelistedCreatorV1 = 4,
  PayoutTicketV1 = 5,
  SafetyDepositValidationTicketV1 = 6,
  AuctionManagerV1 = 7,
  PrizeTrackingTicketV1 = 8,
  SafetyDepositConfigV1 = 9,
  AuctionManagerV2 = 10,
  BidRedemptionTicketV2 = 11,
  AuctionWinnerTokenTypeTrackerV1 = 12,
  StoreIndexerV1 = 13,
  AuctionCacheV1 = 14,
}

export const SCHEMA = new Map<any, any>([
  [
    StoreIndexer,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['store', 'pubkeyAsString'],
        ['page', 'u64'],
        ['auctionCaches', ['pubkeyAsString']],
      ],
    },
  ],
  [
    AuctionCache,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['store', 'pubkeyAsString'],
        ['timestamp', 'u64'],
        ['metadata', ['pubkeyAsString']],
        ['auction', 'pubkeyAsString'],
        ['vault', 'pubkeyAsString'],
        ['auctionManager', 'pubkeyAsString'],
      ],
    },
  ],
]);

export const extendBorsh = () => {
  (BinaryReader.prototype as any).readPubkey = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  (BinaryWriter.prototype as any).writePubkey = function (value: PublicKey) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(value.toBuffer());
  };

  (BinaryReader.prototype as any).readPubkeyAsString = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return base58.encode(array) as StringPublicKey;
  };

  (BinaryWriter.prototype as any).writePubkeyAsString = function (
    value: StringPublicKey,
  ) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(base58.decode(value));
  };
};

extendBorsh();

getMeta().then().catch()
