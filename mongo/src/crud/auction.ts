import {
  AuctionManagerDB,
  AuctionManagerModel,
  AuctionReserveManagerModel
} from "../models";
import {dbSwitcher} from "../switcher_utils";
import * as mongoose from "mongoose";

export async function createAuction(auctionManager: AuctionManagerDB): Promise<void> {
  console.log("auctionManager", auctionManager)
  const switcher = await dbSwitcher.getMainTable('auction');
  console.log("switcher", switcher)
  if (switcher){
    // @ts-ignore
    const model = mongoose.model(switcher.writerTableName)
    console.log(model)
    await model.findOneAndUpdate({manager: auctionManager.manager},
      auctionManager, {
        upsert: true
      });
  }
}

export async function bulkAuctions(auctionManagers: Array<AuctionManagerDB>): Promise<void> {
  const switcher = await dbSwitcher.getMainTable('auction');
  console.log("switcher", switcher)
  let model;
  // @ts-ignore
  switch (switcher.writerTableName) {
    case 'AuctionManager':
      model = AuctionManagerModel;
      break;
    case 'AuctionReserveManager':
      model = AuctionReserveManagerModel;
      break;
    default:
      model = AuctionManagerModel;
      break;
  }
  console.log(model)
  if (model){
    await model.insertMany(auctionManagers, {
      lean: true
    });
  } else {
    console.log('Model from the switcher not found');
  }
}

export async function findAllAuctions(): Promise<AuctionManagerDB[] | null> {
  const switcher = await dbSwitcher.getMainTable('auction');
  console.log("switcher", switcher)
  let model;
  // @ts-ignore
  switch (switcher.readerTableName) {
    case 'AuctionManager':
      model = AuctionManagerModel;
      break;
    case 'AuctionReserveManager':
      model = AuctionReserveManagerModel;
      break;
  }
  console.log(model)
  if (model){
    return model.find({}, {
      _id: 0,
      __v: 0,
      "metadata._id": 0,
      "details.properties.files._id": 0,
      "details.properties.creators._id": 0,
      "details._id": 0,
    });
  } else {
    console.log("Model from the switcher not found")
    return null
  }
}

export async function findAuctionById(auctionManagerId: string):Promise<AuctionManagerDB | null> {
  const switcher = await dbSwitcher.getMainTable('auction');
  console.log("switcher", switcher)
  let model;
  // @ts-ignore
  switch (switcher.readerTableName) {
    case 'AuctionManager':
      model = AuctionManagerModel;
      break;
    case 'AuctionReserveManager':
      model = AuctionReserveManagerModel;
      break;
  }
  console.log(model)
  if (model){
    return model.findOne({manager: auctionManagerId}, {
      _id: 0,
      __v: 0,
      "metadata._id": 0,
      "details.properties.files._id": 0,
      "details.properties.creators._id": 0,
      "details._id": 0,
    });
  } else {
    console.log("Model from the switcher not found")
    return null
  }
}