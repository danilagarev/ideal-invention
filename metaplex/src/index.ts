import {programs} from "@metaplex/js";
import {AuctionDB, MetadataDB} from "../../mongo/src/models";
import {connection} from "./constants";

const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, vault: { Vault } } = programs;


export async function getAuctionsByStore(storePubkey: string): Promise<AuctionDB[]> {
  const store = await Store.load(connection, storePubkey);
  const auctionManagers = await store.getAuctionManagers(connection);
  const auctionPromises = auctionManagers.map((item) => prepareAuction((item)));
  return await Promise.all(auctionPromises);
}

export async function getAuctionsByAuctionManager(aucManagerPubkey: string): Promise<AuctionDB> {
  const auctionManager = await AuctionManager.load(connection, aucManagerPubkey);
  return await prepareAuction(auctionManager);
}
async function getAuctionStateByNum(num: number) {
  switch (num) {
    case 0:
      return "Created"
    case 1:
      return "Started"
    case 2:
      return "Ended"
  }
}

async function prepareAuction(auctionManager: any): Promise<AuctionDB> {
  const auction = await auctionManager.getAuction(connection);
  const vaultPubkey = auctionManager.data.vault;
  const vault = await Vault.load(connection, vaultPubkey);
  const safetyDepositBox = (await vault.getSafetyDepositBoxes(connection))[0];
  const metadata = (await Metadata.findMany(connection,
    {mint: safetyDepositBox.data.tokenMint}))[0].data;
  const auctionState = await getAuctionStateByNum(auction.data.state);

  const metadatadb: MetadataDB = <MetadataDB>{
    name: metadata.data.name,
    symbol: metadata.data.symbol,
    uri: metadata.data.uri
  }

  return <AuctionDB>{
    address: auction.pubkey.toBase58(),
    metadata: metadatadb,
    state: auctionState,
    price: auction.data.priceFloor.minPrice?.toString()
  };
}

getAuctionsByAuctionManager("muk4jM7ydPxjSfCESn8NNPUwgkN2G4uF9vUUAbLM8fX").then().catch()
