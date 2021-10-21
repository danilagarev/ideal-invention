import {
  getAuctionsByAuctionManager,
} from "../../metaplex/src";
import {createAuction} from "../../mongo/src/crud/auction";

export async function addAuction(auctionManager: string): Promise<void> {
  const auction = await getAuctionsByAuctionManager(auctionManager);
  await createAuction(auction);
}