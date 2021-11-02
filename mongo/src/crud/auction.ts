import {AuctionManagerDB, AuctionManagerModel} from "../models";

export async function createAuction(auctionManager: AuctionManagerDB): Promise<void> {
  await AuctionManagerModel.findOneAndUpdate({manager: auctionManager.manager},
    auctionManager, {
      upsert: true
    });
  // await AuctionModel.create(auction);
}

export async function findAllAuctions(): Promise<AuctionManagerDB[]> {
  return AuctionManagerModel.find({}, {
    _id: 0,
    __v: 0,
    "metadata._id": 0,
    "details.properties.files._id": 0,
    "details.properties.creators._id": 0,
    "details._id": 0,
  });
}