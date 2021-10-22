import {AuctionDB, AuctionModel} from "../models";

export async function createAuction(auction: AuctionDB): Promise<void> {
  await AuctionModel.findOneAndUpdate({address: auction.address},
    auction, {
      upsert: true
    });
  // await AuctionModel.create(auction);
}

export async function findAllAuctions(): Promise<AuctionDB[]> {
  return AuctionModel.find({}, {_id: 0, __v: 0, "metadata._id": 0});
}