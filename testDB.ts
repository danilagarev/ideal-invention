// import {AuctionModel} from "./mongo/src/models";
// import {programs, Connection} from "@metaplex/js";
// import {Keypair, PublicKey} from "@solana/web3.js";
// import {TupleNumericType} from "@metaplex/js/lib/utils";
// import BN from "bn.js";
//
// const {metaplex: {AuctionManager, InitAuctionManagerV2}, auction: {Auction, PlaceBid, AuctionExtended}, vault: { Vault, InitVault }} = programs;
//
// async function main () {
//   const auctions = await AuctionModel.find();
//   console.log(auctions);
//   // await AuctionModel.deleteMany({address: "BLadgyLx2FH8iRwxFrmeY4GRadpsHX3fTg3RtGTArzXz"});
//   // await AuctionModel.deleteMany({address: "ABJGeTSYjFQvrHzikh5QgdQwDt8zbTMrzqrS9RXHPT5P"});
// }
//
// async function createVault() {
//   const params = {
//     vault: PublicKey;
//     vaultAuthority: PublicKey;
//     fractionalMint: PublicKey;
//     redeemTreasury: PublicKey;
//     fractionalTreasury: PublicKey;
//     pricingLookupAddress: PublicKey;
//     allowFurtherShareCreation: boolean;
//   };
//   const tx = new InitVault(params);
// }
//
// async function createAuction() {
//   const vault = await createVault();
//   const params = {
//     vault: PublicKey;
//     auction: PublicKey;
//     auctionManager: PublicKey;
//     auctionManagerAuthority: PublicKey;
//     acceptPaymentAccount: PublicKey;
//     tokenTracker: PublicKey;
//     amountType: TupleNumericType;
//     lengthType: TupleNumericType;
//     maxRanges: BN;
// }
//   const auMtxn = new InitAuctionManagerV2(params)
//   const auctionM = "";
//   const connection = new Connection("");
//   await AuctionManager.load(connection, auctionM)
// }
//
// createAuction().then().catch()

// async function placeBid() {
//   const connection = new Connection("https://api.devnet.solana.com");
//   const feePayer = new Keypair();
//   const wrapSolAcc = new Keypair();
//   const auctionManager = await AuctionManager.load(connection,'EWktiZZAbCpVcrvuWiPJia7sNoafASkwu3KdM2pk4F5s');
//   const auction = await Auction.load(connection,auctionManager.data.auction);
//   const vault = await Vault.load(connection, auctionManager.data.vault);
//   const auctionExtended = await AuctionExtended.getPDA(auctionManager.data.vault);
//
//   console.log(auctionManager);
//   console.log(auction);
//   console.log(vault);
//   console.log(auctionExtended);
//   const params = {
//     auction: auction.pubkey,
//     auctionExtended: auctionExtended,
//     bidderPot: "",
//     bidderMeta: "",
//     bidder: feePayer.publicKey,
//     bidderToken: wrapSolAcc,
//     bidderPotToken: "",
//     tokenMint: auction.data.tokenMint,
//     transferAuthority: "",
//     resource: "",
//     amount: auction.data.priceFloor.minPrice
//   };
//   const tx = new PlaceBid(
//     {feePayer: feePayer.publicKey},
//     params);
//
// }

// placeBid().then().catch()

// import {default as axios} from "axios";
// import {NFTDetails} from "./mongo/src/models";
//
// async function getMetadataFromJson(uri: string) {
//   const req = await axios.get(uri);
//   const data = req.data;
//   const details = <NFTDetails>{
//     name: data.name,
//     symbol: data.symbol,
//     description: data.description,
//     seller_fee_basis_points: data.seller_fee_basis_points,
//     image: data.image,
//     external_url: data.external_url,
//     properties: data.properties,
//     attributes: data.attributes
//   }
//   console.log(details);
// }
//
// getMetadataFromJson("https://arweave.net/dgr9mPKQF0vlo9wXKVuHEZx8pfOCRyQ9K0C89YxHdRo").then().catch();

import {PublicKey, Connection} from "@solana/web3.js";
import {programs} from "@metaplex/js";

const {metadata: {Metadata}} = programs;

async function getAllMeta() {
  const conn = new Connection('https://api.devnet.solana.com');
  const metadata = await conn.getProgramAccounts(new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),{filters: [
      {
        memcmp: {
          offset: 326,
          bytes: "AcQVEhdZ8xCA32uvyKWV3F6CLoamzawNHERC8GXeb6tN"
        },
      },
    ]})
  const metadataModels = metadata.map(async (item) => await Metadata.load(conn, item.pubkey))
  console.log(await Promise.all(metadataModels));
}

getAllMeta().then().catch()