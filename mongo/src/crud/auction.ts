import {AuctionDB, AuctionModel} from "../models";

export async function createAuction(auction: AuctionDB): Promise<void> {
  console.log(auction);
  await AuctionModel.findOneAndUpdate({address: auction.address},
    auction, {
      upsert: true
    });
  // await AuctionModel.create(auction);
}