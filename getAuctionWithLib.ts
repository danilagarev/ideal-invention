import {Connection, programs} from "@metaplex/js";

const { metaplex: { Store }, metadata: { Metadata }, vault: { Vault } } = programs;

export const connection = new Connection("https://api.devnet.solana.com");

export type MetadataDB = {
  name: string;
  symbol: string;
  uri: string
}

export interface AuctionDB {
  address: string;
  price: number;
  metadata: MetadataDB;
}

export async function getAuctionsByStore(storePubkey: string): Promise<AuctionDB[]> {
  const store = await Store.load(connection, storePubkey);
  const auctionManagers = await store.getAuctionManagers(connection);
  const auctions = [];
  for (const auctionManager of auctionManagers) {
    const data = await prepareAuction(auctionManager);
    auctions.push(data);
  }
  console.log(auctions);
  return auctions;
}

async function prepareAuction(auctionManager: any): Promise<AuctionDB> {
  const auction = await auctionManager.getAuction(connection);
  const vaultPubkey = auctionManager.data.vault;
  const vault = await Vault.load(connection, vaultPubkey)
  const safetyDepositBox = (await vault.getSafetyDepositBoxes(connection))[0];
  const metadata = (await Metadata.findMany(connection,
    {mint: safetyDepositBox.data.tokenMint}))[0].data;


  const metadatadb: MetadataDB = <MetadataDB>{
    name: metadata.data.name,
    symbol: metadata.data.symbol,
    uri: metadata.data.uri
  }

  return <AuctionDB>{
    address: auction.pubkey.toBase58(),
    metadata: metadatadb,
    price: auction.data.priceFloor.minPrice?.toNumber()
  };
}

getAuctionsByStore("3ZvUMDt6JCEsnLSLZsyvgsxShqtK4AbJRcsjdGVLUNUp").then().catch()
