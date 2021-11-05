import {programs} from "@metaplex/js";
import {AuctionManagerDB, NFTDetails} from "../../mongo/src/models";
import {connection} from "./constants";
import {default as axios} from "axios";

const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, vault: { Vault } } = programs;


export async function getAuctionsByStore(storePubkey: string): Promise<AuctionManagerDB[]> {
  const store = await Store.load(connection, storePubkey);
  const auctionManagers = await store.getAuctionManagers(connection);
  const auctionPromises = auctionManagers.map((item) => prepareAuction((item)));
  return await Promise.all(auctionPromises);
}

export async function getAuctionsByAuctionManager(aucManagerPubkey: string): Promise<AuctionManagerDB> {
  const auctionManager = await AuctionManager.load(connection, aucManagerPubkey);
  return await prepareAuction(auctionManager);
}

async function getMetadataFromJson(uri: string): Promise<NFTDetails> {
  const req = await axios.get(uri);
  const data = req.data;
  return {
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    seller_fee_basis_points: data.seller_fee_basis_points,
    image: data.image,
    external_url: data.external_url,
    properties: data.properties,
    attributes: data.attributes
  }
}

async function prepareAuction(auctionManager: any): Promise<AuctionManagerDB> {
  const auction = await auctionManager.getAuction(connection);
  const vaultPubkey = auctionManager.data.vault;
  const seller = auctionManager.data.authority;
  const vault = await Vault.load(connection, vaultPubkey);
  const safetyDepositBox = (await vault.getSafetyDepositBoxes(connection))[0];
  const metadataAddress = await Metadata.getPDA(safetyDepositBox.data.tokenMint);
  const metadata = (await Metadata.load(connection, metadataAddress)).data;
  const NFTDetailsDB = await getMetadataFromJson(metadata.data.uri);
  return <AuctionManagerDB>{
    auction: auction.pubkey.toBase58(),
    manager: auctionManager.pubkey.toBase58(),
    vault: vault.pubkey.toBase58(),
    seller: seller,
    safetyBox: safetyDepositBox.pubkey.toBase58(),
    metadata: {
      name: metadata.data.name,
      symbol: metadata.data.symbol,
      url: metadata.data.uri
    },
    price: auction.data.priceFloor.minPrice?.toString(),
    state: auction.data.state,
    auctionTokenMint: auction.data.tokenMint,
    details: NFTDetailsDB
  };
}

// getAuctionsByAuctionManager("muk4jM7ydPxjSfCESn8NNPUwgkN2G4uF9vUUAbLM8fX").then().catch()
