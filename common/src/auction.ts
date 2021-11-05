import {
  getAuctionsByAuctionManager,
} from "../../metaplex/src";
import {bulkAuctions, createAuction} from "../../mongo/src/crud/auction";

export async function addAuctions(auctionManagers: Array<string>): Promise<void> {
  const promises = auctionManagers.map(item => getAuctionsByAuctionManager(item));
  const auctionManagerModels = await Promise.all(promises);
  console.log("managers", auctionManagerModels)
  await bulkAuctions(auctionManagerModels);
}

export async function addAuction(auctionManager: string): Promise<void> {
  const auction = await getAuctionsByAuctionManager(auctionManager);
  await createAuction(auction);
}