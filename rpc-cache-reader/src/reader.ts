import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {findAllAuctions, findAuctionById} from "../../mongo/src/crud/auction";
import {getAllTokenSwaps} from "../../mongo/src/crud/tokenSwap";
import {TOKEN_SWAP_PROGRAM_ID} from "../../rpc-cache-utils/src/constants";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/auctions", async (req, res , next) => {
  try {
    const auctions = await findAllAuctions();
    res.json(auctions);
  }catch (e) {
    next(e)
  }
})

app.get("/auctions/:id", async (req, res , next) => {
  try {
    const auctionId = req.params.id
    const auction = await findAuctionById(auctionId);
    if (auction) {
      res.json(auction);
    } else {
      res.status(404).json()
    }
  }catch (e) {
    next(e)
  }
})

app.get("/pools", async (req, res , next) => {
  try {
    const pools = await getAllTokenSwaps(TOKEN_SWAP_PROGRAM_ID);
    res.json(pools);
  }catch (e) {
    next(e)
  }
})

const port = process.env.READER_PORT

app.listen(port);
