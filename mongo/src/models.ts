import { Schema, model, connect } from 'mongoose';

export type MetadataDB = {
  name: string;
  symbol: string;
  uri: string
}

// Document interface
export interface AuctionDB {
  address: string;
  price: number;
  state: string;
  metadata: MetadataDB;
}

// Schema
const MetadataSchema = new Schema<MetadataDB>({
  name: {type: String, required: true},
  symbol: {type: String, required: false},
  uri: {type: String, required: true}
});

const AuctionSchema = new Schema<AuctionDB>({
  address: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  metadata: {type: MetadataSchema, required: true}
});

export const AuctionModel = model('Auction', AuctionSchema);

main().catch(err => console.log(err));

async function main() {
  const uri = "mongodb://admin:test1234@localhost:27017/"
  await connect(uri);
}