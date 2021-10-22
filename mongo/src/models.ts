import {createConnection, Schema} from "mongoose";

export type MetadataDB = {
  name: string;
  symbol: string;
  uri: string
}

// Document interface
export interface AuctionDB {
  address: string;
  price: string;
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
  price: { type: String, required: true },
  state: { type: String, required: true },
  metadata: {type: MetadataSchema, required: true}
});

const mongoHostname = process.env.MONGO_HOSTNAME || "localhost";

export const mongoUri = `mongodb://admin:test1234@${mongoHostname}:27017/`

const connection = createConnection(mongoUri);

export const AuctionModel = connection.model('Auction', AuctionSchema);
