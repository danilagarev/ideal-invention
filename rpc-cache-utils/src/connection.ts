import { Connection } from "@solana/web3.js";
// import { getRedisClient, RedisClientUser } from "./redisClient";
import dotenv from "dotenv";
import {MongoClient} from "mongodb";

dotenv.config();

console.log("creating connection");
export const connection = new Connection(
  "https://api.devnet.solana.com/",
  "recent"
);
// export const redisReadClient = getRedisClient(RedisClientUser.Reader);
// export const redisWriteClient = getRedisClient(RedisClientUser.Writer);

// const uri = "mongodb+srv://test_user:P1mqIAINhffcCy8M@test-cluster.1hnu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = "mongodb://admin:test1234@localhost:27017/"
export const mongoDBClient = new MongoClient(uri, {connectTimeoutMS: 15000});
